export type BlogTag =
  | 'technical'
  | 'non-technical'
  | 'tiki'
  | 'review'
  | 'nx'
  | 'git'
  | 'github'
  | 'devops'
  | 'react'
  | 'typescript'
  | 'javascript'
  | 'tooling'
  | 'tutorial'
  | 'personal';

export interface BlogPost {
  publishDate: Date;
  mdx: typeof import('*.mdx').default;
  slug: string;
  title: string;
  description: string;
  tags: BlogTag[];
}
