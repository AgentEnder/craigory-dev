import { lazy, Suspense, useState, useEffect } from 'react';
import { TokenSetup } from '../components/TokenSetup';
import { loadToken, clearToken } from '../src/token-crypto';
import '../src/style.css';

// Lazy-loaded so GraphiQL (browser-only) never renders during SSR prerendering.
// The `token === undefined` guard ensures this branch is never reached server-side.
const Playground = lazy(() =>
  import('../components/Playground').then((m) => ({ default: m.Playground }))
);

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-600 text-sm">Loading…</div>
    </div>
  );
}

export default function Page() {
  // undefined = not yet loaded from storage; null = no token stored; string = token
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    loadToken().then(setToken);
  }, []);

  if (token === undefined) {
    return <LoadingScreen />;
  }

  if (!token) {
    return <TokenSetup onTokenSaved={setToken} />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Playground
        token={token}
        onClearToken={() => {
          clearToken();
          setToken(null);
        }}
      />
    </Suspense>
  );
}
