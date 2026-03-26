import { useState, useCallback } from 'react';
import '../../src/style.css';
import { generateDigest } from '../../src/generate-digest';

export default function Page() {
  const [prUrl, setPrUrl] = useState('');
  const [token, setToken] = useState('');
  const [digest, setDigest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    setError('');
    setDigest('');
    setCopied(false);

    const trimmed = prUrl.trim();
    if (!trimmed) {
      setError('Please enter a PR URL.');
      return;
    }

    setLoading(true);
    try {
      const result = await generateDigest({
        url: trimmed,
        token: token.trim() || undefined,
      });
      setDigest(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate digest.');
    } finally {
      setLoading(false);
    }
  }, [prUrl, token]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [digest]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([digest], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Extract owner/repo/pr from URL for filename
    const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    const filename = match
      ? `${match[1]}-${match[2]}-pr-${match[3]}.txt`
      : 'pr-digest.txt';
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [digest, prUrl]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PR Digest</h1>
          <p className="text-gray-500 text-sm">
            Generate a comprehensive digest of a GitHub pull request.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-6 animate-fade-in">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pull Request URL
          </label>
          <input
            type="url"
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            placeholder="https://github.com/owner/repo/pull/123"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGenerate();
            }}
          />

          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Token{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_... or leave blank for public repos"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? 'Generating...' : 'Generate Digest'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 animate-fade-in">
            {error}
          </div>
        )}

        {/* Output */}
        {digest && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-700">
                Digest Output
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors active:scale-[0.98]"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors active:scale-[0.98]"
                >
                  Download
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={digest}
              className="w-full h-96 px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono bg-gray-50 resize-y focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
