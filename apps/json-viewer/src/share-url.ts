/**
 * Share links carry the whole session in the URL *fragment*, not a query string.
 * A fragment is never sent to the server: no payload in access logs, no Referer
 * leakage, no per-share CDN cache key, and none of the ~8 KB request-line limits
 * that would otherwise cap the payload at a few KB.
 *
 * The payload is gzipped and base64url-encoded. Density here has to be measured
 * against the *stored* URL, not the visible string: the fragment percent-encode
 * set covers every code point above U+007E, so only 88 ASCII characters survive
 * a fragment untouched and base88 is a hard ceiling. base2048 measured ~4x longer
 * once the browser percent-encoded it; base128 and base256 lose for the same
 * reason. base64url lands within 7% of the ceiling, needs no encoder of our own,
 * and its alphabet never trips link autodetection in chat clients.
 */

// Format label, in plaintext ahead of the payload and outside the compressed
// blob so it can be read *before* anything is decoded — a format cannot version
// itself from the inside. 'A' = gzip + base64url.
const FORMAT = 'A';
const SEPARATOR = '.';
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

/** Fixed key order, so the round-trip check below compares like with like. */
function canonicalize(payload: SharePayload): SharePayload {
  return {
    data: payload.data,
    tab: payload.tab,
    jq: payload.jq,
    ts: payload.ts,
    hidden: payload.hidden,
  };
}

export async function encodeShare(payload: SharePayload): Promise<string> {
  const json = JSON.stringify(canonicalize(payload));
  const bytes = new TextEncoder().encode(json);
  const compressed = await compress(bytes);
  const encoded =
    FORMAT +
    SEPARATOR +
    compressed.toBase64({ alphabet: 'base64url', omitPadding: true });
  console.log(
    '[share] encoded:',
    `json=${bytes.length}B`,
    `gz=${compressed.length}B`,
    `url=${encoded.length}ch`
  );

  // Verify the encoded form decodes back to the exact same JSON. Cheap insurance
  // against any future encoding bug — the user's pasted URL is guaranteed to
  // restore the same data we just encoded.
  const decoded = await decodeShare(encoded);
  if (decoded === null || JSON.stringify(decoded) !== json) {
    throw new ShareIntegrityError();
  }

  return encoded;
}

export async function decodeShare(
  encoded: string
): Promise<SharePayload | null> {
  try {
    const separatorAt = encoded.indexOf(SEPARATOR);
    const format = separatorAt === -1 ? '' : encoded.slice(0, separatorAt);
    if (format !== FORMAT) {
      console.warn(
        '[share] unrecognised format label:',
        format || '(none)',
        '- expected',
        FORMAT
      );
      return null;
    }

    const bytes = Uint8Array.fromBase64(encoded.slice(separatorAt + 1), {
      alphabet: 'base64url',
    });
    const decompressed = await decompress(bytes);
    const json = new TextDecoder().decode(decompressed);
    const obj = JSON.parse(json) as Partial<SharePayload>;
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
  const hash = decodeFragment(window.location.hash);
  if (!hash.startsWith(HASH_PREFIX)) return null;
  return hash.slice(HASH_PREFIX.length);
}

/**
 * Undo any percent-encoding the URL parser applied to a fragment. base64url
 * itself passes through untouched, but a hash the user hand-edited (or an older
 * link) may not, and comparing raw against serialised text is what made the
 * truncation guard fire on every share.
 */
export function decodeFragment(fragment: string): string {
  try {
    return decodeURIComponent(fragment);
  } catch {
    // A malformed %-escape means the fragment really was cut short. Return it
    // as-is so the caller's own length check reports the truncation.
    return fragment;
  }
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
