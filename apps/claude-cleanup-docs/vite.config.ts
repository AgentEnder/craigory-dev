import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), vike()],
  base: (process.env.PUBLIC_ENV__BASE_URL ?? '') + '/claude-cleanup-docs/',
});
