import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

export default {
  extends: vikeReact,
  title: 'Tiki Bar Menu',
  passToClient: ['pageProps', 'urlPathname'],
  prerender: true,
} satisfies Config;
