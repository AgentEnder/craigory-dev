// apps/alt-codes/pages/category/@id/+Head.tsx
import { useData } from 'vike-react/useData';
import type { CategoryData } from './+data.server';

export function Head() {
  const { categoryName, characters } = useData<CategoryData>();
  return (
    <>
      <title>{categoryName} — Glyph Index</title>
      <meta name="description" content={`Browse ${characters.length} Unicode characters in the ${categoryName} category.`} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />
    </>
  );
}
