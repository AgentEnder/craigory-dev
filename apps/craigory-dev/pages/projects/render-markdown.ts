import { REMARK_PLUGINS, REHYPE_PLUGINS } from '../../plugins';
import remarkParse from 'remark-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';

export function renderMarkdownToHTML(md: string) {
  let parser: any = unified();
  parser = parser.use(remarkParse);
  for (const plugin of REMARK_PLUGINS) {
    parser = registerPlugin(parser, plugin);
  }
  for (const plugin of REHYPE_PLUGINS) {
    parser = registerPlugin(parser, plugin);
  }
  parser = parser.use(rehypeStringify);
  return String(parser.processSync(md));
}

function registerPlugin(parser: any, plugin: any) {
  if (Array.isArray(plugin)) {
    const [pluginFn, options] = plugin;
    return parser.use(pluginFn, options);
  }
  return parser.use(plugin);
}
