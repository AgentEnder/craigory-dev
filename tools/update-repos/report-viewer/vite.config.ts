import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
});
