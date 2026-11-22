import { createServer } from 'vite';
import solid from '@solidjs/vite-plugin';

const initialValue = process.argv[2] ?? 'mountains';
const images = process.argv[3] ? JSON.parse(process.argv[3]) : undefined;
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
  const fixture = await vite.ssrLoadModule('/.storybook/listbox-image-explorer-tree.tsx');

  /** Render the shared tree through the published server entry. */
  function renderExplorer() {
    return fixture.renderImageExplorerTree(components, initialValue, images);
  }

  process.stdout.write(renderToString(renderExplorer));
} finally {
  await vite.close();
}
