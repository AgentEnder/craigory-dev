import * as p from '@clack/prompts';

import {
  type PackageManager,
  execSilent,
  execWithOutput,
  execWithActivityTimeout,
  getAuditCommand,
  getAuditFixCommand,
} from './utils.js';

/** Default idle timeout for AI agents: 3 minutes with no output. */
const AGENT_IDLE_TIMEOUT_MS = 3 * 60 * 1000;

const AI_AUDIT_PROMPT = `You are fixing npm audit vulnerabilities in this repository.

Rules:
1. PREFER upgrading/updating packages to compatible versions over adding resolutions or overrides
2. If a peer dependency indicates a newer major version is needed (e.g., "requires vite 8"), upgrade that package rather than overriding the peer dep
3. Run install and verify the audit output is cleaner after your changes
4. Do NOT add "resolutions", "overrides", or "pnpm.overrides" unless there is absolutely no other option
5. Commit your changes when done

The goal is to fix vulnerabilities AND keep dependencies up to date.`;

interface AuditSummary {
  /** Raw JSON output from the audit command */
  rawJson: string;
  /** Severity counts: { critical: N, high: N, moderate: N, low: N, info: N } */
  severities: Record<string, number>;
  /** Total vulnerability count */
  total: number;
}

/**
 * Run `<pm> audit --json` and parse the severity counts.
 * npm and pnpm return different JSON shapes, so we handle both.
 */
async function runAuditJson(
  repoPath: string,
  pm: PackageManager
): Promise<AuditSummary | null> {
  const auditCmd = getAuditCommand(pm, true);
  if (!auditCmd) return null;

  // Run silently — we just want the JSON
  const result = await execWithOutput(auditCmd[0], auditCmd[1], {
    cwd: repoPath,
  });

  const rawJson = result.stdout;

  // Exit code 0 = no vulnerabilities
  if (result.exitCode === 0) {
    return { rawJson, severities: {}, total: 0 };
  }

  try {
    const parsed = JSON.parse(rawJson);
    return parseAuditJson(parsed, rawJson);
  } catch {
    // JSON parse failed — fall back to non-json audit
    return null;
  }
}

function parseAuditJson(
  parsed: Record<string, unknown>,
  rawJson: string
): AuditSummary {
  // npm v7+ format: { metadata: { vulnerabilities: { critical: N, ... } } }
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

  // pnpm format: { advisories: { ... } } with severity field per advisory
  if (parsed.advisories && typeof parsed.advisories === 'object') {
    const advisories = Object.values(
      parsed.advisories as Record<string, { severity?: string }>
    );
    const severities: Record<string, number> = {};
    for (const adv of advisories) {
      const sev = adv.severity ?? 'unknown';
      severities[sev] = (severities[sev] ?? 0) + 1;
    }
    const total = advisories.length;
    return { rawJson, severities, total };
  }

  // Fallback: count top-level vulnerabilities object
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

/**
 * Format severity counts for display.
 * e.g. "3 critical, 5 high, 12 moderate"
 */
function formatSeverities(severities: Record<string, number>): string {
  const order = ['critical', 'high', 'moderate', 'low', 'info'];
  const parts: string[] = [];
  for (const sev of order) {
    if (severities[sev]) {
      parts.push(`${severities[sev]} ${sev}`);
    }
  }
  // Include any severities not in the standard order
  for (const [sev, count] of Object.entries(severities)) {
    if (!order.includes(sev) && count > 0) {
      parts.push(`${count} ${sev}`);
    }
  }
  return parts.join(', ') || 'unknown';
}

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
 * Run an AI agent with a spinner and idle-timeout watchdog.
 * Kills the agent if it produces no output for AGENT_IDLE_TIMEOUT_MS.
 */
async function runAiAgent(
  agent: 'claude' | 'codex',
  prompt: string,
  repoPath: string
): Promise<{ success: boolean; timedOut: boolean }> {
  const s = p.spinner();
  s.start(`${agent} is fixing audit vulnerabilities...`);

  let lastLine = '';
  const onData = (chunk: string) => {
    // Update spinner with the last non-empty line from the agent
    const lines = chunk.split('\n').filter((l) => l.trim());
    if (lines.length > 0) {
      lastLine = lines[lines.length - 1].slice(0, 80);
      s.message(`${agent}: ${lastLine}`);
    }
  };

  const cmdArgs =
    agent === 'claude'
      ? {
          cmd: 'claude',
          args: ['-p', prompt, '--allowedTools', 'Bash,Read,Edit,Write'],
        }
      : {
          cmd: 'codex',
          args: ['--approval-mode', 'full-auto', '-q', prompt],
        };

  const result = await execWithActivityTimeout(cmdArgs.cmd, cmdArgs.args, {
    cwd: repoPath,
    idleTimeoutMs: AGENT_IDLE_TIMEOUT_MS,
    onData,
  });

  if (result.timedOut) {
    s.stop(`${agent} timed out (no output for ${AGENT_IDLE_TIMEOUT_MS / 1000}s)`);
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
  // Run audit with --json to get structured severity info
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
    `Found ${audit.total} vulnerabilities: ${formatSeverities(audit.severities)}`
  );

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
  const agent: 'claude' | 'codex' =
    aiAgent === 'codex' ? 'codex' : 'claude';

  const prompt = `${AI_AUDIT_PROMPT}

Here is the current audit output (JSON):

\`\`\`json
${audit.rawJson}
\`\`\`

Summary: ${audit.total} vulnerabilities — ${formatSeverities(audit.severities)}

Fix these vulnerabilities now.`;

  const { success, timedOut } = await runAiAgent(agent, prompt, repoPath);

  if (timedOut) {
    p.log.error(
      `${agent} appeared to hang — killed after ${AGENT_IDLE_TIMEOUT_MS / 1000}s of silence`
    );
    return false;
  }

  return success;
}
