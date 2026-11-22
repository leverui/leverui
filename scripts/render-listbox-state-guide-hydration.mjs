import { createServer } from 'vite';
import solid from '@solidjs/vite-plugin';

const guide = process.argv[2];
const state = process.argv[3] ?? 'selected';
if (!['basic', 'controlled', 'store'].includes(guide)) {
  throw new Error('Choose basic, controlled, or store for the Listbox state guide.');
}
if (!['initial', 'selected'].includes(state)) throw new Error('Unknown Listbox state guide state.');
const initialValue = state === 'selected' ? ['react'] : [];

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
  const tree = await vite.ssrLoadModule('/.storybook/listbox-state-guide-tree.tsx');

  /** Render one guide using the published server component entry. */
  function renderGuide() {
    return tree.renderListboxStateGuide(components, guide, initialValue);
  }

  process.stdout.write(renderToString(renderGuide));
} finally {
  await vite.close();
}
