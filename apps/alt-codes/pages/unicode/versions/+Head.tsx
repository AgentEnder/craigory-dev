import { useData } from 'vike-react/useData';

// +Head is cumulative down the route tree, so this runs on @version and @category
// descendants too — render only when this page's own data (latest) is present.
export function Head() {
  const data = useData<{ latest?: string }>();
  if (data?.latest === undefined) return null;
  return (
    <>
      <title>Unicode version history — Glyph Index</title>
      <meta
        name="description"
        content={`Browse glyphs by the Unicode version that introduced them, from 1.1 through the current ${data.latest} working draft.`}
      />
    </>
  );
}
