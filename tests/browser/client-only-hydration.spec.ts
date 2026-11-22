import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { ClientOnly as ClientOnlyExport } from '../../src';
import { renderClientOnlyHydrationTree } from '../../.storybook/client-only-hydration-tree';

type ServerExports = { ClientOnly: typeof ClientOnlyExport };
const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ServerExports;

/** Hydrate the published fallback through the browser source export. */
async function hydrateClientOnlyInBrowser(): Promise<void> {
  const modulePath = '/.storybook/client-only-hydration-example.tsx';
  const { hydrateClientOnlyExample } = await import(modulePath);
  const root = document.getElementById('client-only-hydration-root');
  if (!root) throw new Error('ClientOnly hydration root was not found.');
  hydrateClientOnlyExample(root);
}

/** Verify server fallback, deferred browser access, and stable hydration. */
async function verifiesPublishedClientOnlyHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the package server entry. */
    () => renderClientOnlyHydrationTree(components),
  );
  expect(markup).toContain('Loading client content');
  expect(markup).not.toContain('Mounted only');
  expect(markup).not.toContain('hydrated-client-content');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<div id="client-only-hydration-root">${markup}</div>`,
  );
  const stable = page.getByTestId('client-only-stable');
  await stable.evaluate(
    /** Mark the server sibling to detect an unrelated replacement. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  await expect(page.getByTestId('hydrated-fallback')).toBeVisible();
  await expect(page.getByTestId('hydrated-client-content')).toHaveCount(0);
  const errors: string[] = [];

  /** Capture any hydration error from deferred browser content. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateClientOnlyInBrowser);
  await expect(page.locator('#client-only-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(stable).toHaveAttribute('data-server-element', 'true');
  await expect(page.getByTestId('hydrated-fallback')).toHaveCount(0);
  await expect(page.getByTestId('hydrated-client-content')).toHaveText('/iframe.html');
  await expect(page.getByTestId('hydrated-no-fallback')).toHaveText('Mounted only');
  expect(errors).toEqual([]);
}

test(
  'published ClientOnly hydrates its fallback before browser content',
  verifiesPublishedClientOnlyHydration,
);
