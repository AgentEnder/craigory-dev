import { useMemo, useRef, useState } from 'react';
import { GraphiQL } from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import 'graphiql/graphiql.css';

interface RateLimitInfo {
  limit: number;
  remaining: number;
  used: number;
  resetAt: Date;
  lastCost: number | null;
}

function formatReset(resetAt: Date): string {
  const secondsUntil = Math.max(0, Math.floor((resetAt.getTime() - Date.now()) / 1000));
  if (secondsUntil < 60) return 'resets <1m';
  return `resets in ${Math.ceil(secondsUntil / 60)}m`;
}

function RateLimitBadge({ info }: { info: RateLimitInfo }) {
  const pct = info.remaining / info.limit;
  const color =
    pct > 0.5 ? 'text-green-400' : pct > 0.1 ? 'text-yellow-400' : 'text-red-400';

  const title = [
    `Rate limit: ${info.remaining.toLocaleString()} of ${info.limit.toLocaleString()} remaining.`,
    info.lastCost !== null ? `Last request cost: ${info.lastCost}.` : '',
    formatReset(info.resetAt) + '.',
  ].filter(Boolean).join(' ');

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500" title={title}>
      <div className="hidden sm:flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${color.replace('text-', 'bg-')}`} />
        <span className={color}>
          {info.remaining.toLocaleString()}<span className="text-gray-600">/{info.limit.toLocaleString()}</span>
        </span>
        {info.lastCost !== null && (
          <>
            <span className="text-gray-700">·</span>
            <span title="Points consumed by last request">−{info.lastCost}</span>
          </>
        )}
        <span className="text-gray-700">·</span>
        <span>{formatReset(info.resetAt)}</span>
      </div>
      {/* Compact version for small screens */}
      <div className={`sm:hidden ${color}`}>{info.remaining.toLocaleString()}</div>
    </div>
  );
}

const DEFAULT_QUERY = `# Welcome to the GitHub GraphQL Playground
# Schema autocomplete is loaded via introspection from the GitHub API.
#
# Try a simple query to get started:

query {
  viewer {
    login
    name
    url
  }
}
`;

interface Props {
  token: string;
  onClearToken: () => void;
}

export function Playground({ token, onClearToken }: Props) {
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);
  // Ref so the custom fetch closure always calls the latest setter
  // without needing to be included in useMemo's deps.
  const setRateLimitRef = useRef(setRateLimit);
  setRateLimitRef.current = setRateLimit;
  // Tracks state from the previous response to compute per-request cost.
  // Both are required: if the reset timestamp changed the window rolled over and
  // the remaining delta would be meaningless.
  const prevRemainingRef = useRef<number | null>(null);
  const prevResetRef = useRef<number | null>(null);

  const fetcher = useMemo(
    () =>
      createGraphiQLFetcher({
        url: 'https://api.github.com/graphql',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        fetch: async (url: RequestInfo | URL, init?: RequestInit) => {
          const response = await globalThis.fetch(url, init);
          const limit = response.headers.get('X-RateLimit-Limit');
          const remaining = response.headers.get('X-RateLimit-Remaining');
          const used = response.headers.get('X-RateLimit-Used');
          const reset = response.headers.get('X-RateLimit-Reset');
          if (limit && remaining && reset) {
            const currentRemaining = parseInt(remaining, 10);
            const currentReset = parseInt(reset, 10);
            const sameWindow = prevResetRef.current === currentReset;
            const lastCost =
              prevRemainingRef.current !== null && sameWindow
                ? prevRemainingRef.current - currentRemaining
                : null;
            prevRemainingRef.current = currentRemaining;
            prevResetRef.current = currentReset;
            setRateLimitRef.current({
              limit: parseInt(limit, 10),
              remaining: currentRemaining,
              used: used ? parseInt(used, 10) : 0,
              resetAt: new Date(parseInt(reset, 10) * 1000),
              lastCost,
            });
          }
          return response;
        },
      }),
    [token]
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="flex items-center justify-between px-4 h-10 bg-[#1c1c1c] border-b border-[#3d3d3d] shrink-0">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.745 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-300 text-sm font-medium">GitHub GraphQL Playground</span>
        </div>
        <div className="flex items-center gap-3">
          {rateLimit && <RateLimitBadge info={rateLimit} />}
          <button
            onClick={onClearToken}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-gray-800"
          >
            Change token
          </button>
        </div>
      </header>
      <div style={{ flex: 1, minHeight: 0 }}>
        <GraphiQL
          fetcher={fetcher}
          defaultQuery={DEFAULT_QUERY}
        />
      </div>
    </div>
  );
}
