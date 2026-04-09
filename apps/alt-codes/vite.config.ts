import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { categoryDataPlugin } from './vite-plugin-category-data';

export default defineConfig({
  plugins: [react(), tailwindcss(), categoryDataPlugin(), vike()],
  base: (process.env.PUBLIC_ENV__BASE_URL ?? '') + '/alt-codes/',
});
