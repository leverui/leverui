import { defineConfig } from 'vite';
import solid from '@solidjs/vite-plugin';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [solid()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        layout: fileURLToPath(new URL('./layout.html', import.meta.url)),
        presentation: fileURLToPath(new URL('./presentation.html', import.meta.url)),
        content: fileURLToPath(new URL('./content.html', import.meta.url)),
        utility: fileURLToPath(new URL('./utility.html', import.meta.url)),
        alert: fileURLToPath(new URL('./alert.html', import.meta.url)),
        checkmark: fileURLToPath(new URL('./checkmark.html', import.meta.url)),
        emptyState: fileURLToPath(new URL('./empty-state.html', import.meta.url)),
        progress: fileURLToPath(new URL('./progress.html', import.meta.url)),
        progressCircle: fileURLToPath(new URL('./progress-circle.html', import.meta.url)),
        radiomark: fileURLToPath(new URL('./radiomark.html', import.meta.url)),
        skeleton: fileURLToPath(new URL('./skeleton.html', import.meta.url)),
      },
    },
  },
});
