import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    // Per vike.dev/cloudflare, `cloudflare()` must come BEFORE `vike()`: it
    // hosts SSR inside workerd in dev too, which is what makes `c.env` (the KV
    // bindings the page data hooks read) the same object in dev and prod.
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    react(),
    tailwindcss(),
    vike(),
  ],
  environments: {
    ssr: {
      optimizeDeps: {
        // Hono and its Vike adapter are ESM-native, so pre-bundling buys
        // nothing — and letting the SSR optimizer re-bundle them mid-startup
        // kills the workerd runner ("there is a new version of the pre-bundle
        // for hono.js"), which takes `vike dev` down with it on every boot.
        exclude: ['hono', '@vikejs/hono'],
      },
    },
  },
});
