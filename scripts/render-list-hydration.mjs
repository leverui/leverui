import { createServer } from 'vite';
import solid from '@solidjs/vite-plugin';

/** Compile shared List JSX through the published server entry. */
async function renderPublishedList() {
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
    const fixture = await vite.ssrLoadModule('/.storybook/list-hydration-tree.tsx');
    return renderToString(
      /** Reuse this JSX tree during browser hydration. */
      () => fixture.renderListHydrationTree(publishedServer),
    );
  } finally {
    await vite.close();
  }
}

process.stdout.write(await renderPublishedList());
