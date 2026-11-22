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
  const fixture = await vite.ssrLoadModule('/.storybook/listbox-emoji-tree.tsx');
  const initialSelection = process.argv.includes('--selected') ? ['1F600'] : [];
  process.stdout.write(
    renderToString(
      /** Render the same tree used by Storybook and published hydration. */
      () => fixture.renderListboxEmojiTree(components, initialSelection),
    ),
  );
} finally {
  await vite.close();
}
