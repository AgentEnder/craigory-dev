import { useState, type FormEvent } from 'react';
import { storeToken } from '../src/token-crypto';

interface Props {
  onTokenSaved: (token: string) => void;
}

export function TokenSetup({ onTokenSaved }: Props) {
  const [token, setToken] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) {
      setError('Please enter a token.');
      return;
    }
    if (!trimmed.startsWith('ghp_') && !trimmed.startsWith('github_pat_') && !trimmed.startsWith('gho_') && !trimmed.startsWith('ghs_')) {
      setError('This doesn\'t look like a GitHub token. Classic tokens start with ghp_, fine-grained tokens start with github_pat_.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await storeToken(trimmed);
      onTokenSaved(trimmed);
    } catch {
      setError('Failed to save token. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-800 mb-4">
            <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.745 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1">GitHub GraphQL Playground</h1>
          <p className="text-gray-400 text-sm">Connect with a personal access token to explore the GitHub API</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-300 mb-2">
                Personal Access Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => { setToken(e.target.value); setError(null); }}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
                spellCheck={false}
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Stored locally with AES-256 encryption. Never sent anywhere except GitHub's API.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || !token.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
            >
              {saving ? 'Connecting…' : 'Connect to GitHub'}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-800 pt-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              How to get a token
            </h2>
            <ol className="space-y-2 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="text-gray-600 shrink-0">1.</span>
                <span>
                  Go to{' '}
                  <span className="text-gray-300 font-mono text-xs">GitHub → Settings → Developer settings → Personal access tokens</span>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-600 shrink-0">2.</span>
                <span>
                  Choose <strong className="text-gray-300 font-medium">Tokens (classic)</strong> for broad access or <strong className="text-gray-300 font-medium">Fine-grained tokens</strong> for scoped access.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-600 shrink-0">3.</span>
                <span>
                  For classic tokens, select scopes: <span className="text-gray-300 font-mono text-xs">repo</span> (private repos) or <span className="text-gray-300 font-mono text-xs">public_repo</span> (public only). Add <span className="text-gray-300 font-mono text-xs">read:org</span>, <span className="text-gray-300 font-mono text-xs">read:user</span> for org/user queries.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-600 shrink-0">4.</span>
                <span>
                  Copy the generated token (shown only once) and paste it above.
                </span>
              </li>
            </ol>
            <p className="mt-4 text-xs text-gray-600">
              Direct link:{' '}
              <span className="font-mono text-gray-500 break-all">
                github.com/settings/tokens/new
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
