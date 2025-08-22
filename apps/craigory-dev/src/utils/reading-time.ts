import { BlogPost } from '@new-personal-monorepo/blog-posts';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';

export function calculateReadingTimeFromPost(post: BlogPost): number {
  try {
    // Provide stub components for MDX rendering
    const stubComponents = {
      Anchor: () => null, // Just ignore anchors for text extraction
      LinkToPost: () => null, // Ignore link components
      TikiTable: ({ children }: { children?: any }) => children || '', // Pass through table content
      pre: ({ children }: { children?: any }) => children || '', // Keep code content for word count
    };
    
    // Try to render the MDX to HTML and extract text content
    const htmlString = renderToString(createElement(post.mdx, { components: stubComponents }));
    const textContent = extractTextFromHTML(htmlString);
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    
    // If we got very few words, something went wrong
    if (wordCount < 10) {
      throw new Error(`Very low word count for ${post.slug}: ${wordCount} words - check MDX rendering`);
    }
    
    const readingTime = calculateReadingTimeFromText(textContent);
    return readingTime;
  } catch (error) {
    throw new Error(`Could not calculate reading time for post ${post.slug}: ${error?.message || error}`);
  }
}

function extractTextFromHTML(html: string): string {
  // Remove HTML tags and get plain text
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove style tags
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#x27;/g, "'") // Replace &#x27; with '
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

export function calculateReadingTimeFromText(text: string): number {
  // Text is already cleaned HTML, just count words
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// For client-side calculation from DOM content
export function calculateReadingTimeFromDOM(element: Element): number {
  const text = element.textContent || '';
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}