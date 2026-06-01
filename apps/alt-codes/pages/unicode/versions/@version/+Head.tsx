import { useData } from 'vike-react/useData';

// +Head is cumulative, so this also runs on @category descendants whose data has no
// `total` — guard on it so this Head only renders on the @version page itself.
export function Head() {
  const data = useData<{ version?: string; total?: number }>();
  if (data?.total === undefined || data?.version === undefined) return null;
  return (
    <>
      <title>Added in Unicode {data.version} — Glyph Index</title>
      <meta
        name="description"
        content={`${data.total.toLocaleString()} glyphs were introduced in Unicode ${data.version}. Browse them by category.`}
      />
    </>
  );
}
