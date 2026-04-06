import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss(), vike()],
  base: (process.env.PUBLIC_ENV__BASE_URL ?? '') + '/gh-graphql/',
});
