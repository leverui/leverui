import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'website/src/lib/**/*.test.ts'],
    setupFiles: ['./tests/vitest-setup.ts'],
  },
});
