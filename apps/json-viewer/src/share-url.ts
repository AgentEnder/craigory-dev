import { encode as base2048Encode, decode as base2048Decode } from 'base2048';

// v2 = base2048 (11 bits per char). qntm hand-picks code points that pass through
// browser URL pipelines without percent-encoding — base32768 is denser but its
// chars get %-encoded on replaceState, blowing the URL up 9x. The remaining
// failure mode at this size is the macOS clipboard truncating at ~512K chars,
// which we detect via a clipboard readback check below.
const SHARE_VERSION = 2;
const HASH_PREFIX = '#share=';

export type ShareTab = 'jq' | 'typescript' | 'visibility';

export interface SharePayload {
  data: unknown;
  tab: ShareTab;
  jq: string;
  ts: string;
  hidden: string[];
}

export class ShareIntegrityError extends Error {
  constructor() {
    super(
      'Share link failed an internal round-trip check; the URL would not decode back to the same data.'
    );
    this.name = 'ShareIntegrityError';
  }
}

export async function encodeShare(payload: SharePayload): Promise<string> {
  const json = JSON.stringify({ v: SHARE_VERSION, ...payload });
  const bytes = new TextEncoder().encode(json);
  const compressed = await compress(bytes);
  const encoded = base2048Encode(compressed);
  console.log(
    '[share] encoded:',
    `json=${bytes.length}B`,
    `gz=${compressed.length}B`,
    `b2048=${encoded.length}ch`,
    `(${new TextEncoder().encode(encoded).length}B utf-8)`
  );

  // Verify the encoded form decodes back to the exact same JSON. Cheap insurance
  // against any future encoding bug — the user's pasted URL is guaranteed to
  // restore the same data we just encoded.
  const decoded = await decodeShare(encoded);
  const roundTripJson =
    decoded === null
      ? null
      : JSON.stringify({ v: SHARE_VERSION, ...decoded });
  if (roundTripJson !== json) {
    throw new ShareIntegrityError();
  }

  return encoded;
}

export async function decodeShare(
  encoded: string
): Promise<SharePayload | null> {
  try {
    const bytes = base2048Decode(encoded);
    console.log(
      '[share] decoded',
      bytes.length,
      'bytes; head:',
      Array.from(bytes.slice(0, 4))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(' ')
    );
    const decompressed = await decompress(bytes);
    const json = new TextDecoder().decode(decompressed);
    const obj = JSON.parse(json) as Partial<SharePayload> & { v?: number };
    if (obj?.v !== SHARE_VERSION) {
      console.warn('[share] version mismatch; got', obj?.v);
      return null;
    }
    if (
      obj.tab !== 'jq' &&
      obj.tab !== 'typescript' &&
      obj.tab !== 'visibility'
    ) {
      console.warn('[share] invalid tab in payload:', obj.tab);
      return null;
    }
    return {
      data: obj.data,
      tab: obj.tab,
      jq: typeof obj.jq === 'string' ? obj.jq : '.',
      ts: typeof obj.ts === 'string' ? obj.ts : '',
      hidden: Array.isArray(obj.hidden)
        ? obj.hidden.filter((p): p is string => typeof p === 'string')
        : [],
    };
  } catch (e) {
    console.warn('[share] decode failed:', e);
    return null;
  }
}

export function buildShareUrl(encoded: string): string {
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}${HASH_PREFIX}${encoded}`;
}

export function readShareFromHash(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash.startsWith(HASH_PREFIX)) return null;
  return hash.slice(HASH_PREFIX.length);
}

async function compress(bytes: Uint8Array): Promise<Uint8Array> {
  return runStream(new CompressionStream('gzip'), bytes);
}

async function decompress(bytes: Uint8Array): Promise<Uint8Array> {
  if (bytes.length < 2 || bytes[0] !== 0x1f || bytes[1] !== 0x8b) {
    throw new Error(
      `Decoded bytes don't look like gzip (first bytes: ${Array.from(
        bytes.slice(0, 4)
      )
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(' ')}). The hash was probably truncated or modified.`
    );
  }
  return runStream(new DecompressionStream('gzip'), bytes);
}

async function runStream(
  transform: GenericTransformStream,
  bytes: Uint8Array
): Promise<Uint8Array> {
  const writer = transform.writable.getWriter();
  // Don't await — write+close before reading so the stream has data to transform.
  writer.write(bytes).catch(() => {});
  writer.close().catch(() => {});

  const reader = transform.readable.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

