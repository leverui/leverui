import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from '@solidjs/vite-plugin';

export default defineConfig({
  plugins: [solid()],
  build: {
    rollupOptions: {
      input: fileURLToPath(new URL('./skip-nav.html', import.meta.url)),
    },
  },
});
