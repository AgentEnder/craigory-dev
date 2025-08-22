import { useEffect, useState, useRef, useCallback } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface BlogPostEnhancedProps {
  children: React.ReactNode;
}

export function BlogPostEnhanced({ children }: BlogPostEnhancedProps) {
  const [progress, setProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progress = (scrollPosition / scrollHeight) * 100;
      setProgress(Math.min(100, Math.max(0, progress)));
      
      // Show/hide scroll to top button
      setShowScrollTop(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate table of contents
  useEffect(() => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h2, h3, h4');
      const tocItems: TOCItem[] = [];
      
      headings.forEach((heading) => {
        const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
        if (!heading.id) {
          heading.id = id;
        }
        
        // Get text content without the hash symbol from heading links
        const headingClone = heading.cloneNode(true) as HTMLElement;
        const hashLink = headingClone.querySelector('.heading-link');
        if (hashLink) {
          hashLink.remove();
        }
        const cleanText = headingClone.textContent?.trim() || '';
        
        tocItems.push({
          id,
          text: cleanText,
          level: parseInt(heading.tagName[1])
        });
      });
      
      setToc(tocItems);
    }
  }, [children]);

  // Track active heading for TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    const headings = contentRef.current?.querySelectorAll('h2, h3, h4');
    headings?.forEach((heading) => observer.observe(heading));

    return () => {
      headings?.forEach((heading) => observer.unobserve(heading));
    };
  }, [toc]);

  // Add copy buttons to code blocks
  useEffect(() => {
    const codeBlocks = contentRef.current?.querySelectorAll('pre code');
    
    codeBlocks?.forEach((block) => {
      const pre = block.parentElement;
      if (!pre) return;
      
      // Check if button already exists
      if (pre.querySelector('.copy-button')) return;
      
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.textContent = 'Copy';
      
      button.addEventListener('click', () => {
        const text = block.textContent || '';
        navigator.clipboard.writeText(text).then(() => {
          button.textContent = 'Copied!';
          button.classList.add('copied');
          setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
          }, 2000);
        });
      });
      
      pre.appendChild(button);
    });
  }, [children]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* Reading Progress Bar */}
      <div 
        className="reading-progress" 
        style={{ transform: `scaleX(${progress / 100})` }}
      />

      {/* Table of Contents */}
      {toc.length > 0 && (
        <div className="toc-container">
          <h3>Table of Contents</h3>
          <ul>
            {toc.map((item) => (
              <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 1}rem` }}>
                <a 
                  href={`#${item.id}`}
                  className={activeHeading === item.id ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="blog-post-container">
        {/* Blog Content - h1 will be rendered by MDX with our custom component */}
        <div className="blog-content" ref={contentRef}>
          {children}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button 
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </>
  );
}