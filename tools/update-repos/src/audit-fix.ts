import * as p from '@clack/prompts';

import {
  type PackageManager,
  execSilent,
  execWithOutput,
  getAuditCommand,
  getAuditFixCommand,
} from './utils.js';

const AI_AUDIT_PROMPT = `You are fixing npm audit vulnerabilities in this repository.

Rules:
1. PREFER upgrading/updating packages to compatible versions over adding resolutions or overrides
2. If a peer dependency indicates a newer major version is needed (e.g., "requires vite 8"), upgrade that package rather than overriding the peer dep
3. Run install and verify the audit output is cleaner after your changes
4. Do NOT add "resolutions", "overrides", or "pnpm.overrides" unless there is absolutely no other option
5. Commit your changes when done

The goal is to fix vulnerabilities AND keep dependencies up to date.`;

/**
 * Check if the working tree has uncommitted changes.
 */
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
 * Fix npm audit vulnerabilities, optionally using an AI agent.
 * Returns true if any changes were made.
 */
export async function fixAudit(
  repoPath: string,
  pm: PackageManager,
  aiAgent: string
): Promise<boolean> {
  // Capture current audit output
  const auditCmd = getAuditCommand(pm);
  if (!auditCmd) {
    p.log.warn(`Audit not supported for ${pm}, skipping`);
    return false;
  }

  p.log.step('Running audit...');
  const auditResult = await execWithOutput(auditCmd[0], auditCmd[1], {
    cwd: repoPath,
  });

  const auditOutput = auditResult.stdout + auditResult.stderr;

  // If audit is clean, nothing to do
  if (auditResult.exitCode === 0) {
    p.log.success('No audit vulnerabilities found');
    return false;
  }

  if (aiAgent === 'false') {
    // Non-AI path: just run audit fix
    const fixCmd = getAuditFixCommand(pm);
    if (!fixCmd) {
      p.log.warn(`Audit fix not supported for ${pm}, skipping`);
      return false;
    }

    p.log.step('Running audit fix...');
    await execWithOutput(fixCmd[0], fixCmd[1], { cwd: repoPath });
    return hasChanges(repoPath);
  }

  // AI-driven path
  const agent = aiAgent === 'codex' ? 'codex' : 'claude';
  p.log.step(`Spawning ${agent} to fix audit vulnerabilities...`);

  const prompt = `${AI_AUDIT_PROMPT}

Here is the current audit output:

\`\`\`
${auditOutput}
\`\`\`

Fix these vulnerabilities now.`;

  if (agent === 'claude') {
    const result = await execWithOutput(
      'claude',
      ['-p', prompt, '--allowedTools', 'Bash,Read,Edit,Write'],
      { cwd: repoPath }
    );
    return result.exitCode === 0;
  } else {
    const result = await execWithOutput(
      'codex',
      ['--approval-mode', 'full-auto', '-q', prompt],
      { cwd: repoPath }
    );
    return result.exitCode === 0;
  }
}
