import vikeReact from 'vike-react/config';
import type { Config } from 'vike/types';

export default {
  extends: [vikeReact],
  prerender: true,
  ssr: true,
  trailingSlash: false,
  clientRouting: false,
  redirects: {
    '/projects/qbcheck-simulator': '/qbcheck-simulator',
    '/projects/qr-generator': '/qr-generator',
  },
} satisfies Config;
