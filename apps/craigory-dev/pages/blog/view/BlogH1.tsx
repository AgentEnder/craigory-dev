import { format } from 'date-fns';
import { useContext, useEffect, useRef } from 'react';
import { PostContext } from '@new-personal-monorepo/blog-posts';

interface BlogH1Props {
  children: React.ReactNode;
}

export function BlogH1({ children }: BlogH1Props) {
  const post = useContext(PostContext);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Add this header to the blog-header class for styling
    if (headerRef.current) {
      headerRef.current.classList.add('blog-header');
    }
  }, []);

  if (!post) {
    // Fallback for non-blog h1 elements
    return <h1>{children}</h1>;
  }

  return (
    <header ref={headerRef} className="blog-header">
      {/* Above the title rather than below it: the cover is the post's
          establishing shot, and it is the same image the social card is built
          from, so a reader arriving from a share sees what they clicked. */}
      {post.cover && (
        <figure className="post-cover">
          <img src={post.cover.src} alt={post.cover.alt} />
        </figure>
      )}
      <h1>{children}</h1>
      <div className="meta-info">
        <span className="publish-date">
          {format(post.publishDate, 'MMMM dd, yyyy')}
        </span>
        {post.readingTimeMinutes && (
          <span className="reading-time">
            <span role="img" aria-label="reading time">📖</span> {post.readingTimeMinutes} min read
          </span>
        )}
      </div>
    </header>
  );
}