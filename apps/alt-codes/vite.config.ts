import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { categoryDataPlugin } from './vite-plugin-category-data';
import { versionDataPlugin } from './vite-plugin-version-data';

export default defineConfig({
  plugins: [react(), tailwindcss(), categoryDataPlugin(), versionDataPlugin(), vike()],
  base: (process.env.PUBLIC_ENV__BASE_URL ?? '') + '/alt-codes/',
});
