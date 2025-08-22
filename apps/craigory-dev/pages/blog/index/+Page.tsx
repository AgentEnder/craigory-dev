import { getBlogUrl, pages, blogPosts, BlogPost } from '@new-personal-monorepo/blog-posts';
import { usePageContext } from 'vike-react/usePageContext';
import { formatDateString } from '@new-personal-monorepo/date-utils';
import { format } from 'date-fns';
import { useCallback, useEffect, useState, useMemo } from 'react';

import './index.page.scss';
import { Link } from '../../../renderer/Link';
import { BlogFilterBar } from '../components/blog-filter-bar';

export function Page() {
  const pageContext = usePageContext();
  const hookData = pageContext.data as { readingTimes?: Record<string, number> } | undefined;
  const { readingTimes } = hookData || {};
  const pageNumber = tryOr(
    () => parseInt(pageContext.routeParams?.pageNumber ?? '1'),
    1
  );

  // Memoize posts with reading times to prevent infinite re-renders
  const allPosts = useMemo(() => 
    blogPosts.map(post => ({
      ...post,
      readingTimeMinutes: readingTimes?.[post.slug]
    })), 
    [readingTimes]
  );
  
  const [filterFn, setFilterFn] = useState<((p: BlogPost) => boolean) | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  
  const filteredPages = useMemo(() => {
    const pageSize = 10;
    const result: BlogPost[][] = [];
    for (let i = 0; i < filteredPosts.length; i += pageSize) {
      result.push(filteredPosts.slice(i, i + pageSize));
    }
    return result.length > 0 ? result : [[]];
  }, [filteredPosts]);

  // Update filtered posts when allPosts or filter changes
  useEffect(() => {
    setFilteredPosts(
      filterFn ? allPosts.filter((p) => filterFn(p)) : allPosts
    );
  }, [filterFn, allPosts]);

  const onSetFilter = useCallback(
    (fn: (p: BlogPost) => boolean) => {
      setFilterFn(() => fn);
    },
    [setFilterFn]
  );

  const currentPagePosts = filteredPages[pageNumber - 1] || [];

  return (
    <>
      <div className="blog-index-header">
        <h1>Blog</h1>
      </div>
      <BlogFilterBar
        onSetFilter={onSetFilter}
        posts={allPosts}
      />
      <div className="posts-container">
        {currentPagePosts.map((post) => (
          <div id={post.slug} key={post.slug} className="post-container">
            <p key={post.title + 'PUBLISH DATE'} className="date">
              {format(post.publishDate, 'MMM dd, yyyy')}
            </p>
            <h2 key={post.title + 'TITLE'} className="title">
              <Link href={getBlogUrl(post) + `?ref=/blog/${pageNumber}`}>
                {post.title}
              </Link>
            </h2>
            <div key={post.title + 'DESCRIPTION'} className="description">
              {post.description.split('\n').map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="post-meta">
              {post.readingTimeMinutes && (
                <span className="reading-time">
                  <span role="img" aria-label="reading time">📖</span> {post.readingTimeMinutes} min read
                </span>
              )}
              <div className="tags">
                {post.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredPages.length > 1 && (
        <div className="pagination">
          <div className="pagination-controls">
            <Link 
              href={`/blog/${Math.max(1, pageNumber - 1)}`}
              className={`pagination-button ${pageNumber === 1 ? 'disabled' : ''}`}
              aria-disabled={pageNumber === 1}
            >
              ← Previous
            </Link>
            <p className="pagination-info">
              Page {pageNumber} of {filteredPages.length}
              {filteredPosts.length !== allPosts.length && 
                ` (${filteredPosts.length} posts matching filter)`
              }
            </p>
            <Link 
              href={`/blog/${Math.min(filteredPages.length, pageNumber + 1)}`}
              className={`pagination-button ${pageNumber === filteredPages.length ? 'disabled' : ''}`}
              aria-disabled={pageNumber === filteredPages.length}
            >
              Next →
            </Link>
          </div>
        </div>
      )}
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
