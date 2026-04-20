import { usePageContext } from 'vike-react/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  // Vike sets `is404` directly on pageContext when the prerender miss
  // path or a thrown `render(404)` resolves; `abortStatusCode` is only
  // populated for runtime aborts, so we check both.
  const is404 =
    pageContext.is404 === true || pageContext.abortStatusCode === 404;

  return (
    <article className="docs-article">
      <h1>{is404 ? 'Page not found' : 'Something went wrong'}</h1>
      <p>
        {is404
          ? "That page doesn't exist. Try the sidebar or head back to the "
          : 'An error occurred while rendering this page. Head back to the '}
        <a href="/">overview</a>.
      </p>
    </article>
  );
}
