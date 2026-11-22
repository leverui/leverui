import { createServer } from 'vite';
import solid from '@solidjs/vite-plugin';

const initialOffset = Number(process.argv[2] ?? 0);
if (!Number.isFinite(initialOffset) || initialOffset < 0) {
  throw new Error('The virtualized Listbox offset must be a nonnegative number.');
}

const vite = await createServer({
  configFile: false,
  plugins: [solid({ ssr: true, solid: { hydratable: true } })],
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
});

try {
  // Load Solid and the published server entry through Vite, so the shared
  // tree and the components use one Solid instance and its hydration keys.
  const { renderToString } = await vite.ssrLoadModule('@solidjs/web');
  const components = await vite.ssrLoadModule('/dist/server/index.js');
  const fixture = await vite.ssrLoadModule('/.storybook/listbox-virtualized-tree.tsx');

  /** Render the same country collection through the published server entry. */
  function renderCountries() {
    return fixture.renderVirtualizedListbox(components, initialOffset);
  }

  process.stdout.write(renderToString(renderCountries));
} finally {
  await vite.close();
}
