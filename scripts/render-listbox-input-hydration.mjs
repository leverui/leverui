import { createServer } from 'vite';
import solid from '@solidjs/vite-plugin';

const variant = process.argv[2];
const visualQuery = process.argv[3] ?? '';
if (!['filter', 'keyboard-priority'].includes(variant)) {
  throw new Error('Expected a Listbox input guide variant.');
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
  const fixture = await vite.ssrLoadModule('/.storybook/listbox-input-tree.tsx');

  /** Keep visual-only query subsets separate from the interactive hydration tree. */
  function renderVariant() {
    if (variant === 'keyboard-priority') return fixture.renderKeyboardPriorityTree(components);
    return visualQuery
      ? fixture.renderStaticFilterFixture(components, visualQuery)
      : fixture.renderFilterTree(components);
  }

  process.stdout.write(renderToString(renderVariant));
} finally {
  await vite.close();
}
