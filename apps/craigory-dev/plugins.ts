import rehypeAutolinkHeadings, {
  type Options as RehypeAutolinkOptions,
} from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import rehypeMdxCodeProps from 'rehype-mdx-code-props';
import rehypeSlug from 'rehype-slug';
import remarkRehype from 'remark-rehype';
import remarkSmartypants from 'remark-smartypants';
import remarkToc from 'remark-toc';

const rehypeAutolinkHeadingsOptions: RehypeAutolinkOptions = {
  behavior: 'append',
  content: {
    type: 'text',
    value: '#',
  },
  properties: {
    className: 'heading-link',
  },
  test: (el) => {
    if (el.type === 'element') {
      if (el.tagName === 'h1') return false;
      if (
        el.tagName === 'h2' &&
        el.children?.find(
          (el) => el.type === 'text' && el.value === 'Table of Contents'
        )
      )
        return false;
    }
    return true;
  },
};

export const REMARK_PLUGINS = [remarkToc, remarkSmartypants, remarkRehype];

export const REHYPE_PLUGINS = [
  rehypeSlug,
  [
    rehypeExternalLinks,
    {
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
    },
  ],
  rehypeHighlight,
  rehypeMdxCodeProps,
  [rehypeAutolinkHeadings, rehypeAutolinkHeadingsOptions],
];
