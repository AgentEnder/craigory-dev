import { mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import * as p from '@clack/prompts';

import {
  type PackageManager,
  execQuiet,
  execSilent,
  execWithActivityTimeout,
  getAuditCommand,
  getAuditFixCommand,
  getInstallCommand,
} from './utils.js';

/** Idle timeout for AI agents: 10 minutes with no output. */
const AGENT_IDLE_TIMEOUT_MS = 10 * 60 * 1000;

const AI_AUDIT_SYSTEM_PROMPT = `You are an expert dependency manager fixing npm audit vulnerabilities.

## Strategy (in order of preference)

1. **Upgrade to the latest version** of vulnerable packages. Check what the latest
   version is (e.g. \`npm view <pkg> version\`) and upgrade to it. If vite 6 has a
   vulnerability and vite 7 exists, upgrade to vite 7 — don't stop at vite 6.

2. **Upgrade transitive dependency parents.** If a vulnerability is in a transitive
   dependency, upgrade the direct dependency that pulls it in. This often resolves
   the vulnerability without touching the transitive dep directly.

3. **Use \`npm audit fix\` or equivalent** for straightforward semver-compatible fixes
   after you've handled the major upgrades.

4. **As an absolute last resort**, add overrides/resolutions — but ONLY scoped to the
   specific vulnerable transitive path, NEVER as a global version pin. See the
   "Override Rules" section below.

## Override Rules — CRITICAL

Global overrides (e.g. \`"minimatch": "3.1.5"\`) are DANGEROUS. They force EVERY
package in the tree to use that version, even packages that require a different
major. This WILL break things.

**If you must add an override:**

1. First run \`npm ls <package>\` to see which packages depend on it and what
   versions they require. Check that your override version is compatible with
   ALL consumers.

2. **Scope the override** to the specific vulnerable path rather than globally:
   \`\`\`json
   // WRONG — global override, breaks packages needing minimatch@10
   "overrides": { "minimatch": "3.1.2" }

   // RIGHT — scoped to the specific vulnerable transitive path
   "overrides": { "vulnerable-parent>minimatch": "3.1.2" }

   // pnpm equivalent
   "pnpm": { "overrides": { "vulnerable-parent>minimatch": "3.1.2" } }
   \`\`\`

3. After adding any override, run install and verify:
   - No peer dependency conflicts or resolution errors
   - The project still builds/works (\`npm run build\` or equivalent)
   - The override actually fixes the vulnerability (\`npm audit\`)

4. If an override would force a DOWNGRADE of a package that other deps need at a
   higher major version, DO NOT add it. Instead, skip that vulnerability and note
   it in your commit message.

## Verification Checklist (run before committing)

After ALL changes, verify:
1. \`<pm> install\` succeeds without errors
2. \`<pm> audit\` shows improvement (fewer/less severe vulnerabilities)
3. No override forces a global version that conflicts with other packages
4. Check \`npm ls <overridden-package>\` to confirm no version conflicts

## Rules

- NEVER add overrides/resolutions as a first step. Always try upgrading first.
- NEVER add global (unscoped) overrides. Always scope to the vulnerable path.
- When upgrading, go to the LATEST version, not just the minimum fix version.
  The goal is to keep deps current, not just patch vulnerabilities.
- If a package has a peer dep warning suggesting a newer major (e.g. "requires
  vite >=7"), that's a signal to UPGRADE, not to add a peer dep override.
- Commit your changes when done with a descriptive message.
- Focus on critical and high severity first, then moderate, then low.
- If you cannot fix a vulnerability without breaking the project, skip it and
  note it in your commit message — leaving it unfixed is better than breaking
  the dependency tree.`;

interface AuditSummary {
  rawJson: string;
  severities: Record<string, number>;
  total: number;
}

async function runAuditJson(
  repoPath: string,
  pm: PackageManager
): Promise<AuditSummary | null> {
  const auditCmd = getAuditCommand(pm, true);
  if (!auditCmd) return null;

  const result = await execQuiet(auditCmd[0], auditCmd[1], {
    cwd: repoPath,
    dumpOnFailure: false,
  });

  const rawJson = result.stdout;

  if (result.exitCode === 0) {
    return { rawJson, severities: {}, total: 0 };
  }

  try {
    const parsed = JSON.parse(rawJson);
    return parseAuditJson(parsed, rawJson);
  } catch {
    return null;
  }
}

function parseAuditJson(
  parsed: Record<string, unknown>,
  rawJson: string
): AuditSummary {
  // npm v7+ format
  if (parsed.metadata && typeof parsed.metadata === 'object') {
    const meta = parsed.metadata as Record<string, unknown>;
    if (meta.vulnerabilities && typeof meta.vulnerabilities === 'object') {
      const vulns = meta.vulnerabilities as Record<string, number>;
      const severities: Record<string, number> = {};
      let total = 0;
      for (const [sev, count] of Object.entries(vulns)) {
        if (typeof count === 'number' && count > 0 && sev !== 'total') {
          severities[sev] = count;
          total += count;
        }
      }
      return { rawJson, severities, total };
    }
  }

  // pnpm format
  if (parsed.advisories && typeof parsed.advisories === 'object') {
    const advisories = Object.values(
      parsed.advisories as Record<string, { severity?: string }>
    );
    const severities: Record<string, number> = {};
    for (const adv of advisories) {
      const sev = adv.severity ?? 'unknown';
      severities[sev] = (severities[sev] ?? 0) + 1;
    }
    return { rawJson, severities, total: advisories.length };
  }

  // Fallback
  if (parsed.vulnerabilities && typeof parsed.vulnerabilities === 'object') {
    const vulns = Object.values(
      parsed.vulnerabilities as Record<string, { severity?: string }>
    );
    const severities: Record<string, number> = {};
    for (const v of vulns) {
      const sev = v.severity ?? 'unknown';
      severities[sev] = (severities[sev] ?? 0) + 1;
    }
    return { rawJson, severities, total: vulns.length };
  }

  return { rawJson, severities: {}, total: 0 };
}

function formatSeverities(severities: Record<string, number>): string {
  const order = ['critical', 'high', 'moderate', 'low', 'info'];
  const parts: string[] = [];
  for (const sev of order) {
    if (severities[sev]) {
      parts.push(`${severities[sev]} ${sev}`);
    }
  }
  for (const [sev, count] of Object.entries(severities)) {
    if (!order.includes(sev) && count > 0) {
      parts.push(`${count} ${sev}`);
    }
  }
  return parts.join(', ') || 'unknown';
}

/**
 * Check package.json for unscoped global overrides that could break the
 * dependency tree. Returns a list of problems found.
 */
function validateOverrides(repoPath: string): string[] {
  const problems: string[] = [];
  try {
    const pkg = JSON.parse(
      readFileSync(join(repoPath, 'package.json'), 'utf-8')
    );

    // Check npm overrides
    if (pkg.overrides && typeof pkg.overrides === 'object') {
      for (const [key, value] of Object.entries(pkg.overrides)) {
        // Scoped overrides use "parent>dep" syntax; unscoped are just "dep"
        if (!key.includes('>') && typeof value === 'string') {
          problems.push(
            `Unscoped npm override: "${key}": "${value}" — should use "parent>${key}" syntax`
          );
        }
      }
    }

    // Check pnpm overrides
    if (pkg.pnpm?.overrides && typeof pkg.pnpm.overrides === 'object') {
      for (const [key, value] of Object.entries(pkg.pnpm.overrides)) {
        if (!key.includes('>') && typeof value === 'string') {
          problems.push(
            `Unscoped pnpm override: "${key}": "${value}" — should use "parent>${key}" syntax`
          );
        }
      }
    }

    // Check yarn resolutions
    if (pkg.resolutions && typeof pkg.resolutions === 'object') {
      for (const [key, value] of Object.entries(pkg.resolutions)) {
        // Yarn resolutions use "**/<dep>" for global, or "parent/dep" for scoped
        if (!key.includes('/') && typeof value === 'string') {
          problems.push(
            `Unscoped yarn resolution: "${key}": "${value}" — may conflict with other packages`
          );
        }
      }
    }
  } catch {
    // Can't read package.json — skip validation
  }
  return problems;
}

function hasChanges(repoPath: string): boolean {
  try {
    execSilent('git diff --quiet', repoPath);
    execSilent('git diff --cached --quiet', repoPath);
    return false;
  } catch {
    return true;
  }
}

/**
 * Write the audit JSON and prompt to temp files, then invoke the AI agent
 * pointing at those files. This avoids E2BIG errors from large audit output.
 */
async function runAiAgent(
  agent: 'claude' | 'codex',
  audit: AuditSummary,
  pm: PackageManager,
  repoPath: string
): Promise<{ success: boolean; timedOut: boolean }> {
  // Write audit output and prompt to temp files
  const tempDir = join(tmpdir(), 'update-repos-audit');
  mkdirSync(tempDir, { recursive: true });

  const auditFilePath = join(tempDir, 'audit.json');
  const promptFilePath = join(tempDir, 'prompt.md');
  const systemPromptFilePath = join(tempDir, 'system-prompt.md');

  writeFileSync(auditFilePath, audit.rawJson);
  writeFileSync(systemPromptFilePath, AI_AUDIT_SYSTEM_PROMPT);

  const userPrompt = [
    `Fix the npm audit vulnerabilities in this repository.`,
    ``,
    `Package manager: ${pm}`,
    `Summary: ${audit.total} vulnerabilities — ${formatSeverities(audit.severities)}`,
    ``,
    `The full audit JSON output is at: ${auditFilePath}`,
    `Read that file to understand the specific vulnerabilities.`,
    ``,
    `Remember: upgrade to the LATEST versions, not just minimum fixes.`,
    `Check \`npm view <pkg> version\` to find the latest before upgrading.`,
  ].join('\n');

  writeFileSync(promptFilePath, userPrompt);

  const s = p.spinner();
  s.start(`${agent} is fixing audit vulnerabilities...`);

  const cmdArgs =
    agent === 'claude'
      ? {
          cmd: 'claude',
          args: [
            '-p',
            userPrompt,
            '--verbose',
            '--output-format',
            'stream-json',
            '--include-partial-messages',
            '--system-prompt-file',
            systemPromptFilePath,
            '--allowedTools',
            'Bash,Read,Edit,Write',
          ],
        }
      : {
          cmd: 'codex',
          args: ['--approval-mode', 'full-auto', '-q', userPrompt],
        };

  const result = await execWithActivityTimeout(cmdArgs.cmd, cmdArgs.args, {
    cwd: repoPath,
    idleTimeoutMs: AGENT_IDLE_TIMEOUT_MS,
    label: `${agent}: audit fix`,
  });

  // Clean up temp files
  try {
    unlinkSync(auditFilePath);
    unlinkSync(promptFilePath);
    unlinkSync(systemPromptFilePath);
  } catch {
    // Non-critical
  }

  if (result.timedOut) {
    s.stop(
      `${agent} timed out (no output for ${AGENT_IDLE_TIMEOUT_MS / 1000}s)`
    );
    return { success: false, timedOut: true };
  }

  if (result.exitCode === 0) {
    s.stop(`${agent} finished successfully`);
  } else {
    s.stop(`${agent} exited with code ${result.exitCode} (see log file for details)`);
  }

  return { success: result.exitCode === 0, timedOut: false };
}

/**
 * Fix npm audit vulnerabilities, optionally using an AI agent.
 * Returns true if any changes were made.
 */
export async function fixAudit(
  repoPath: string,
  pm: PackageManager,
  aiAgent: string
): Promise<boolean> {
  const audit = await runAuditJson(repoPath, pm);

  if (!audit) {
    p.log.warn(`Audit not supported for ${pm}, skipping`);
    return false;
  }

  if (audit.total === 0) {
    p.log.success('No audit vulnerabilities found');
    return false;
  }

  p.log.warn(
    `Found ${audit.total} vulnerabilities: ${formatSeverities(
      audit.severities
    )}`
  );

  if (aiAgent === 'false') {
    const fixCmd = getAuditFixCommand(pm);
    if (!fixCmd) {
      p.log.warn(`Audit fix not supported for ${pm}, skipping`);
      return false;
    }

    p.log.step('Running audit fix...');
    await execQuiet(fixCmd[0], fixCmd[1], { cwd: repoPath });
    return hasChanges(repoPath);
  }

  const agent: 'claude' | 'codex' = aiAgent === 'codex' ? 'codex' : 'claude';

  // Snapshot existing overrides before the agent runs so we only flag new ones
  const preExistingProblems = new Set(
    validateOverrides(repoPath).map((p) => p)
  );

  const { success, timedOut } = await runAiAgent(agent, audit, pm, repoPath);

  if (timedOut) {
    p.log.error(
      `${agent} appeared to hang — killed after ${
        AGENT_IDLE_TIMEOUT_MS / 1000
      }s of silence`
    );
    return false;
  }

  if (!success) {
    return false;
  }

  // Post-fix validation: check for NEW problematic overrides added by the agent
  const allProblems = validateOverrides(repoPath);
  const newProblems = allProblems.filter((p) => !preExistingProblems.has(p));
  if (newProblems.length > 0) {
    p.log.warn(`Agent introduced ${newProblems.length} problematic override(s):`);
    for (const problem of newProblems) {
      p.log.warn(`  ${problem}`);
    }
    p.log.warn(
      'Unscoped overrides can break the dependency tree — review before merging'
    );
  }

  // Verify install still works after all changes
  const [installCmd, installArgs] = getInstallCommand(pm);
  const installResult = await execQuiet(installCmd, installArgs, {
    cwd: repoPath,
    dumpOnFailure: false,
  });

  if (installResult.exitCode !== 0) {
    p.log.error(
      'Install failed after audit fix — changes may be broken (see log file)'
    );
  }

  return hasChanges(repoPath);
}
