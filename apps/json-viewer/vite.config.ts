import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss(), vike()],
  optimizeDeps: { exclude: ['jq-web'] },
  build: {},
  base: (process.env.PUBLIC_ENV__BASE_URL ?? '') + '/json-viewer/',
});
