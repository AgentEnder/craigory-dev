import type { ProviderId } from '../worker/types';

/**
 * Whether what was typed is a link rather than a song title.
 *
 * Deliberately looser than the providers' own `parsePlaylistUrl`, and not a
 * copy of it: the server stays the authority on what is importable, and answers
 * a 422 naming the supported shapes when it is not. This only has to decide
 * which of two things the box is being used for, and nothing that parses as a
 * URL is ever a useful search term.
 *
 * The host match exists purely to name the service in the affordance. An
 * unrecognised host still imports — the server will say so if it cannot.
 */
const HOSTS: [RegExp, ProviderId][] = [
  [/(^|\.)spotify\.com$/, 'spotify'],
  [/(^|\.)apple\.com$/, 'apple'],
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/, 'youtube'],
  [/(^|\.)deezer\.com$|(^|\.)deezer\.page\.link$/, 'deezer'],
];

export interface PastedLink {
  url: string;
  /** Undefined when the host is unknown; the import is still attempted. */
  provider?: ProviderId;
}

export function asPastedLink(input: string): PastedLink | null {
  const text = input.trim();
  if (!/^https?:\/\//i.test(text)) return null;
  let parsed: URL;
  try {
    parsed = new URL(text);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^www\./, '');
  const match = HOSTS.find(([pattern]) => pattern.test(host));
  return { url: text, provider: match?.[1] };
}
