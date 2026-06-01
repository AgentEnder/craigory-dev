import type { Config } from 'vike/types';

// Client-only: these glyphs (the CJK & Scripts bucket) are NOT prerendered — there are
// 12k+ of them. The page renders in the browser, computing encodings from the URL's code
// points and fetching name/version from the version-category JSON slice. Reachable via
// in-app navigation and, for cold deep-links, the GitHub Pages 404.html SPA redirect.
export default {
  ssr: false,
  prerender: false,
} satisfies Config;
