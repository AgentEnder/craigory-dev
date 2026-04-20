import { usePageContext } from 'vike-react/usePageContext';

export default function Page() {
  const { abortStatusCode } = usePageContext();
  const is404 = abortStatusCode === 404;

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
