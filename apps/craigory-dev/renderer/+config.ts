import type { Config } from 'vike/types';
import react from 'vike-react/config';
import { Head } from './Head';

export default {
  extends: react,
  meta: {
    // We create a new setting called `title`
    title: {
      // The value of `title` should be loaded only on the server
      env: { server: true },
    },
    desc: {
      env: { server: true },
    },
  },
  passToClient: [
    'pageProps',
    'urlPathname',
    'urlParsed',
    'routeParams',
    'data',
  ],
  title: 'Craigory Coppola',
  Head,
  clientRouting: false,
  ssr: true,
} satisfies Config;
