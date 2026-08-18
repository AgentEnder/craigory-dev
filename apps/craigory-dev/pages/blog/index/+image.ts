import { absoluteSiteUrl } from '../../../renderer/site-url';

/**
 * The index is paginated, and every page of it shares the one card. The default
 * in `renderer/+image.ts` would give each page its own — `/blog/2/og.png` and so
 * on — which is a card per page saying "Blog, page 2": more files to generate
 * and nothing gained, since nobody shares page four of an archive expecting
 * different artwork.
 *
 * `/blog` is not itself a route (the nav links to `/blog/1`), so this path only
 * ever names the generated file.
 */
export default () => absoluteSiteUrl('/blog/og.png');
