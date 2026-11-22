import { createServer } from 'vite';
import solid from '@solidjs/vite-plugin';

/** Compile consumer TSX for server rendering with Solid's JSX transform. */
async function renderPublishedJsx() {
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
    const fixture = await vite.ssrLoadModule('/.storybook/icon-jsx-hydration-tree.tsx');
    return renderToString(
      /** Render the package's server entry through the compiled JSX fixture. */
      () => fixture.renderIconJsxHydrationTree(publishedServer),
    );
  } finally {
    await vite.close();
  }
}

process.stdout.write(await renderPublishedJsx());
