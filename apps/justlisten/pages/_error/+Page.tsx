import { Card, ErrorPill } from '@new-personal-monorepo/small-app-design-system';
import { usePageContext } from 'vike-react/usePageContext';

/**
 * Shared error page. The data hooks abort with a human-readable reason
 * (`render(404, '…')`), so prefer that over a generic status message — an
 * expired playlist is a normal, explainable outcome rather than a fault.
 */
export function Page() {
  const { is404, abortReason, abortStatusCode } = usePageContext();
  const reason = typeof abortReason === 'string' ? abortReason : undefined;

  if (is404 || abortStatusCode === 404) {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="text-center">
          <p aria-hidden="true" className="text-4xl text-gray-300">
            ♪
          </p>
          <h1 className="mt-3 text-xl font-bold text-gray-900">Not found</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            {reason ?? 'That page could not be found.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="/"
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
            >
              Search for a song
            </a>
            <a
              href="/import"
              className="rounded-2xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:border-blue-300 hover:text-blue-600 active:scale-[0.98]"
            >
              Import a playlist
            </a>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <ErrorPill>{reason ?? 'Something went wrong on our end.'}</ErrorPill>
        <p className="mt-4 text-sm text-gray-500">
          Try again in a moment, or head{' '}
          <a href="/" className="font-medium text-blue-600 hover:underline">
            back to search
          </a>
          .
        </p>
      </Card>
    </div>
  );
}
