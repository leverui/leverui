import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { Loader as LoaderExport, LoaderOverlay as LoaderOverlayExport } from '../../src';
import { renderLoaderHydrationTree } from '../../.storybook/loader-hydration-tree';

type ServerExports = {
  Loader: typeof LoaderExport;
  LoaderOverlay: typeof LoaderOverlayExport;
};

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser Loader tree to its server-rendered host. */
async function hydrateLoaderInBrowser(): Promise<void> {
  const modulePath = '/.storybook/loader-hydration-example.tsx';
  const { hydrateLoaderExample } = await import(modulePath);
  const root = document.getElementById('loader-hydration-root');
  if (!root) throw new Error('Loader hydration root was not found.');
  hydrateLoaderExample(root);
}

/** Verify native node identity, overlay styles, and reactive visibility. */
async function verifiesLoaderHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same Loader tree through the published server components. */
    () => renderLoaderHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="loader-hydration-root">${markup}</div>`,
  );
  const loader = page.locator('#hydrated-loader');
  const overlay = page.locator('#hydrated-loader-overlay');
  await expect(loader).toHaveCSS('display', 'contents');
  await expect(overlay).toHaveCSS('width', '200px');
  await loader.evaluate(
    /** Mark the native server span before hydration. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  await overlay.evaluate(
    /** Mark the native server overlay before hydration. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  const errors: string[] = [];

  /** Record errors raised while Loader hydrates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateLoaderInBrowser);
  await expect(page.locator('#loader-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(loader).toHaveAttribute('data-server-element', 'true');
  await expect(overlay).toHaveAttribute('data-server-element', 'true');
  expect(errors).toEqual([]);
  await page.locator('#loader-hydration-toggle').click();
  await expect(loader).toHaveCount(0);
  await expect(page.locator('#loader-hydration-host')).toContainText('Ready');
  await expect(overlay).toHaveCSS('width', '200px');
}

test('Loader and LoaderOverlay hydrate without replacing native nodes', verifiesLoaderHydration);
