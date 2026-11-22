import { createServer } from 'vite';
import solid from '@solidjs/vite-plugin';

/** Compile shared Breadcrumb JSX through the published server entry. */
async function renderPublishedBreadcrumb() {
  const vite = await createServer({
    configFile: false,
    logLevel: 'silent',
    plugins: [solid({ ssr: true, solid: { hydratable: true } })],
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });
  try {
    // Load Solid and the published server entry through Vite, so the shared
    // tree and the components use one Solid instance and its hydration keys.
    const { renderToString } = await vite.ssrLoadModule('@solidjs/web');
    const publishedServer = await vite.ssrLoadModule('/dist/server/index.js');
    const fixture = await vite.ssrLoadModule('/.storybook/breadcrumb-hydration-tree.tsx');
    return renderToString(
      /** Reuse this JSX tree during browser hydration. */
      () => fixture.renderBreadcrumbHydrationTree(publishedServer),
    );
  } finally {
    await vite.close();
  }
}

process.stdout.write(await renderPublishedBreadcrumb());
