import { createServer } from 'vite';
import solid from '@solidjs/vite-plugin';

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
  const fixture = await vite.ssrLoadModule('/.storybook/listbox-dialog-tree.tsx');

  /** Publish the initially open Dialog and its grouped Listbox as HTML. */
  function renderGuide() {
    return fixture.renderListboxDialog(components, { initiallyOpen: true });
  }

  process.stdout.write(renderToString(renderGuide));
} finally {
  await vite.close();
}
