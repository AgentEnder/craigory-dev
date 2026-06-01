import { useData } from 'vike-react/useData';

export function Head() {
  const data = useData<{ version?: string; name?: string; count?: number }>();
  if (data?.count === undefined || data?.name === undefined || data?.version === undefined) return null;
  return (
    <>
      <title>{data.name} added in Unicode {data.version} — Glyph Index</title>
      <meta
        name="description"
        content={`${data.count.toLocaleString()} ${data.name} glyphs introduced in Unicode ${data.version}.`}
      />
    </>
  );
}
