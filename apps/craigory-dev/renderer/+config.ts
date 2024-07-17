import type { Config } from 'vike/types';

export default {
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
  passToClient: ['pageProps', 'urlPathname', 'urlParsed', 'routeParams'],
} satisfies Config;
