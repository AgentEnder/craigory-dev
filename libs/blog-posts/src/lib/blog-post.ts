export interface BlogPost {
  publishDate: Date;
  mdx: typeof import('*.mdx').default;
  slug: string;
  title: string;
  description: string;
}
