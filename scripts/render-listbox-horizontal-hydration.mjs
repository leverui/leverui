import { createServer } from 'vite';
import solid from '@solidjs/vite-plugin';
import { selectedHorizontalAlbum } from '../demos/listbox-horizontal-data.ts';

const state = process.argv[2] ?? 'selected';
if (!['initial', 'selected'].includes(state)) {
  throw new Error('Choose initial or selected Horizontal Listbox state.');
}
const albums = process.argv[3] ? JSON.parse(process.argv[3]) : undefined;
const initialValue = state === 'selected' ? [selectedHorizontalAlbum] : [];
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
  const tree = await vite.ssrLoadModule('/.storybook/listbox-horizontal-tree.tsx');

  /** Render the shared album cards through the published server package. */
  function renderGuide() {
    return tree.renderHorizontalListbox(components, initialValue, albums);
  }

  process.stdout.write(renderToString(renderGuide));
} finally {
  await vite.close();
}
