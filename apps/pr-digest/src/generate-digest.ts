export interface DigestInput {
  url?: string;
  owner?: string;
  repo?: string;
  pr?: number;
  token?: string;
}

// Lazily import pr-digest to avoid SSR issues — the CLI tries to detect the
// current git repo at init time. We use cli.sdk() for programmatic invocation.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sdkPromise: Promise<(args: Record<string, any>) => Promise<unknown>> | null =
  null;

function getSdk() {
  if (!sdkPromise) {
    sdkPromise = import('pr-digest')
      .then((mod) => {
        const sdk = mod.cli.sdk();
        return sdk;
      })
      .catch((error) => {
        sdkPromise = null;
        throw error;
      });
  }
  return sdkPromise;
}

export async function generateDigest(input: DigestInput): Promise<string> {
  // Initialize SDK first — this triggers cli-forge builder which prints
  // usage text to stdout. We don't want to capture that.
  const sdk = await getSdk();

  // Now intercept stdout/console.log only during the actual handler execution.
  const chunks: string[] = [];
  const originalWrite = globalThis.process.stdout.write;
  globalThis.process.stdout.write = (chunk: unknown) => {
    chunks.push(String(chunk));
    return true;
  };

  const originalLog = console.log;
  const logChunks: string[] = [];
  console.log = (...args: unknown[]) => {
    logChunks.push(args.map(String).join(' '));
  };

  try {
    const result = await sdk({
      ...input,
      output: undefined,
    });

    // If the handler returned a string, use that
    if (typeof result === 'string' && result.length > 0) {
      return result;
    }

    // Otherwise use the captured stdout output
    if (chunks.length > 0) {
      return chunks.join('');
    }

    // Fall back to console.log output
    if (logChunks.length > 0) {
      return logChunks.join('\n');
    }

    return 'No output was generated. The PR may not exist or may require authentication.';
  } finally {
    globalThis.process.stdout.write = originalWrite;
    console.log = originalLog;
  }
}
