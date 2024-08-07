import { PageContext } from 'vike/types';

export function Page({ is404, abortReason, abortStatusCode }: PageContext) {
  if (is404) {
    return (
      <>
        <h1>404 Page Not Found</h1>
        <p>This page could not be found.</p>
      </>
    );
  } else {
    return (
      <>
        <h1>500 Internal Error</h1>
        <p>Something went wrong.</p>
        <p>{JSON.stringify(abortReason)}</p>
        <p>{abortStatusCode}</p>
      </>
    );
  }
}
