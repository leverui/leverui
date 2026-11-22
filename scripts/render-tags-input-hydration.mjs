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
  const guide = process.argv.includes('--guide');
  // Load Solid and the published server entry through Vite, so the shared
  // tree and the components use one Solid instance and its hydration keys.
  const { renderToString } = await vite.ssrLoadModule('@solidjs/web');
  const components = await vite.ssrLoadModule('/dist/server/index.js');
  const fixture = await vite.ssrLoadModule(
    guide
      ? '/.storybook/tags-input-guide-hydration-tree.tsx'
      : '/.storybook/tags-input-hydration-tree.tsx',
  );
  process.stdout.write(
    renderToString(
      /** Render shared JSX with the published server components. */
      () =>
        guide
          ? fixture.renderTagsInputGuideHydrationTree(components)
          : fixture.renderTagsInputHydrationTree(components),
    ),
  );
} finally {
  await vite.close();
}
