import { pages } from '@new-personal-monorepo/blog-posts';
import { usePageContext } from 'vike-react/usePageContext';
import { formatDateString } from '@new-personal-monorepo/date-utils';
import { format } from 'date-fns';

import './index.page.scss';
import { Link } from '../../../renderer/Link';

export function Page() {
  const pageContext = usePageContext();
  const page = tryOr(
    () => parseInt(pageContext.routeParams?.pageNumber ?? '1'),
    1
  );

  return (
    <>
      <h1>Blog</h1>
      <div className="posts-container">
        {pages[page - 1].map((post) => (
          <div
            key={post.slug}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1em',
              alignItems: 'top',
            }}
          >
            <div id={post.slug} className={`post-container`}>
              <h2 key={post.title + 'TITLE'} className="title">
                <Link
                  href={`/blog/${formatDateString(post.publishDate)}/${
                    post.slug
                  }?ref=/blog/${page}`}
                >
                  {post.title}
                </Link>
              </h2>
              <p key={post.title + 'PUBLISH DATE'} className="date">
                {format(post.publishDate, 'MMM dd, yyyy')}
              </p>
              <div key={post.title + 'DESCRIPTION'} className="description">
                {post.description.split('\n').map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function tryOr<T, T2>(fn: () => T, or: T2) {
  try {
    return fn();
  } catch {
    return or;
  }
}
