const STORAGE_KEY = 'gh-gql-token-v1';
// This key is embedded in the bundle — the encryption is obfuscation,
// not a security guarantee. The intent is that the raw token is not
// immediately visible as plain text in localStorage.
const KEY_MATERIAL = 'gh-graphql-playground-craigory-dev-v1';
const PBKDF2_SALT = new TextEncoder().encode('gh-gql-site-salt-v1');

async function deriveKey(): Promise<CryptoKey> {
  const raw = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(KEY_MATERIAL),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: PBKDF2_SALT, iterations: 100_000, hash: 'SHA-256' },
    raw,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function storeToken(token: string): Promise<void> {
  const key = await deriveKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(token)
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  const encoded = btoa(String.fromCharCode(...combined));
  localStorage.setItem(STORAGE_KEY, encoded);
}

export async function loadToken(): Promise<string | null> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const key = await deriveKey();
    const combined = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    // Corrupted or from a different key — clear and prompt re-entry
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearToken(): void {
  localStorage.removeItem(STORAGE_KEY);
}
