import { createServer } from 'vite';
import solid from '@solidjs/vite-plugin';
import { selectedCollectionValues } from '../.storybook/listbox-collection-guide-data.ts';

const guide = process.argv[2];
const state = process.argv[3] ?? 'selected';
if (!['disabled', 'grouped', 'multiple'].includes(guide)) {
  throw new Error('Choose disabled, grouped, or multiple for the Listbox collection guide.');
}
if (!['initial', 'selected'].includes(state)) {
  throw new Error('Choose initial or selected Listbox collection state.');
}
const initialValue = state === 'selected' ? selectedCollectionValues[guide] : [];

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
  const tree = await vite.ssrLoadModule('/.storybook/listbox-collection-guide-tree.tsx');

  /** Render one guide through the published server package entry. */
  function renderGuide() {
    return tree.renderListboxCollectionGuide(components, guide, initialValue);
  }

  process.stdout.write(renderToString(renderGuide));
} finally {
  await vite.close();
}
