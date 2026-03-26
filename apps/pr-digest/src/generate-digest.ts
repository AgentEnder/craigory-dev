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
    sdkPromise = import('pr-digest').then((mod) => {
      const sdk = mod.cli.sdk();
      return sdk;
    });
  }
  return sdkPromise;
}

export async function generateDigest(input: DigestInput): Promise<string> {
  const sdk = await getSdk();
  const result = await sdk({
    ...input,
    // Prevent the CLI handler from trying to write to a file
    output: undefined,
  });
  return typeof result === 'string' ? result : String(result);
}
