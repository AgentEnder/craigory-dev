import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['libs/small-app-design-system/src/**/*.spec.tsx'],
    globals: true,
  },
});
