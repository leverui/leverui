import { createServer } from 'vite';
import solid from '@solidjs/vite-plugin';

const variant = process.argv[2];
const initialSelection = process.argv.includes('--selected') ? ['react'] : [];
if (!['checkmark', 'description', 'icon'].includes(variant)) {
  throw new Error('Expected a Listbox presentation variant.');
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
  const fixture = await vite.ssrLoadModule('/.storybook/listbox-presentation-tree.tsx');
  /** Choose the same variant tree used by Storybook and browser hydration. */
  function renderVariant() {
    switch (variant) {
      case 'checkmark':
        return fixture.renderCheckmarkTree(components, initialSelection);
      case 'description':
        return fixture.renderDescriptionTree(components, initialSelection);
      case 'icon':
        return fixture.renderIconTree(components, initialSelection);
    }
  }
  process.stdout.write(renderToString(renderVariant));
} finally {
  await vite.close();
}
