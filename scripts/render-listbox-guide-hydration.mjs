import { createServer } from 'vite';
import solid from '@solidjs/vite-plugin';
import { selectAllFrameworks } from '../.storybook/listbox-guide-data.ts';

const guide = process.argv[2];
const state = process.argv[3] ?? (guide === 'select-all' ? 'mixed' : 'initial');
if (guide !== 'select-all' && guide !== 'extended') {
  throw new Error('Choose select-all or extended for the Listbox server fixture.');
}
if (!['initial', 'mixed', 'all', 'selected', 'focused', 'scrolled'].includes(state)) {
  throw new Error('Unknown Listbox guide state.');
}
const initialValue =
  state === 'all'
    ? selectAllFrameworks.map(
        /** Supply every framework value to the all-selected fixture. */
        (item) => item.value,
      )
    : state === 'mixed'
      ? ['react']
      : state === 'selected'
        ? ['react', 'vue']
        : [];

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
  const fixture = await vite.ssrLoadModule('/.storybook/listbox-guide-tree.tsx');

  /** Render the selected guide using the published server component entry. */
  function renderGuide() {
    return guide === 'select-all'
      ? fixture.renderSelectAllGuide(components, initialValue)
      : fixture.renderExtendedGuide(components, initialValue);
  }

  process.stdout.write(renderToString(renderGuide));
} finally {
  await vite.close();
}
