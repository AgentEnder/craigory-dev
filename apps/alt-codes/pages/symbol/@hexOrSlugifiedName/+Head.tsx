// apps/alt-codes/pages/symbol/@hex/+Head.tsx
import { useData } from 'vike-react/useData';
import type { SymbolData } from './+data.server';

export function Head() {
  const { entry } = useData<SymbolData>();
  const label = entry.name || entry.hex;
  return (
    <>
      <title>{entry.char} {label} — Glyph Index</title>
      <meta name="description" content={`Unicode ${entry.hex} — ${label}. UTF-8, HTML entity, alt code, and related characters.`} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />
    </>
  );
}
