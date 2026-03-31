import { mkdirSync, writeFileSync, unlinkSync } from 'node:fs';
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

4. **As an absolute last resort**, add overrides/resolutions for vulnerabilities that
   cannot be fixed any other way. Before adding an override, you MUST verify:
   - The direct dependency has no newer version that fixes the issue
   - There is no alternative package that could replace it
   - Document WHY the override is needed in a code comment

## Rules

- NEVER add overrides/resolutions as a first step. Always try upgrading first.
- When upgrading, go to the LATEST version, not just the minimum fix version.
  The goal is to keep deps current, not just patch vulnerabilities.
- After making changes, run install and re-run audit to verify improvements.
- If a package has a peer dep warning suggesting a newer major (e.g. "requires
  vite >=7"), that's a signal to UPGRADE, not to add a peer dep override.
- Commit your changes when done with a descriptive message.
- Focus on critical and high severity first, then moderate, then low.
- If you cannot fix a vulnerability without breaking the project, skip it and
  note it in your commit message.`;

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
    s.stop(`${agent} exited with code ${result.exitCode}`);
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

  const { success, timedOut } = await runAiAgent(agent, audit, pm, repoPath);

  if (timedOut) {
    p.log.error(
      `${agent} appeared to hang — killed after ${
        AGENT_IDLE_TIMEOUT_MS / 1000
      }s of silence`
    );
    return false;
  }

  return success;
}
