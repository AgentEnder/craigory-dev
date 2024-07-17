import { pages } from '@new-personal-monorepo/blog-posts';
import { usePageContext } from '@new-personal-monorepo/vike-utils';
import { formatDateString } from '@new-personal-monorepo/date-utils';
import { format } from 'date-fns';

import './index.page.scss';

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
              <h2
                style={{
                  margin: 0,
                }}
                key={post.title + 'TITLE'}
                className="title"
              >
                <a
                  href={`/blog/${formatDateString(post.publishDate)}/${
                    post.slug
                  }?ref=/blog/${page}`}
                >
                  {post.title}
                </a>
              </h2>
              <div key={post.title + 'PUBLISH DATE'} className="date">
                {format(post.publishDate, 'MMM dd, yyyy')}
              </div>
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
