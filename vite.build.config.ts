import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import solid from '@solidjs/vite-plugin';
import {
  externalDependenciesPlugin,
  externalImportPath,
  isExternalDependency,
} from './vite.external';

export default defineConfig({
  plugins: [externalDependenciesPlugin(), solid({ ssr: true, solid: { hydratable: true } })],
  resolve: {
    alias: [
      {
        find: /^\.\/native-select-server-options$/,
        replacement: resolve(
          import.meta.dirname,
          'src/components/native-select-server-options.browser.ts',
        ),
      },
    ],
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: isExternalDependency,
      output: {
        preserveModules: true,
        preserveModulesRoot: resolve(import.meta.dirname, 'src'),
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        paths: externalImportPath,
      },
    },
  },
});
