import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  plugins: [solid({ ssr: true, solid: { hydratable: true } })],
  test: {
    environment: 'node',
    include: ['tests/server/**/*.test.ts'],
  },
});
