import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { For as ForExport } from '../../src';
import { renderForHydrationTree } from '../../.storybook/for-hydration-tree';

type ServerExports = { For: typeof ForExport };
const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as ServerExports;

/** Hydrate the published list in the Storybook browser page. */
async function hydrateForInBrowser(): Promise<void> {
  const modulePath = '/.storybook/for-hydration-example.tsx';
  const { hydrateForExample } = await import(modulePath);
  const root = document.getElementById('for-hydration-root');
  if (!root) throw new Error('For hydration root was not found.');
  hydrateForExample(root);
}

/** Verify the server fallback stays stable through hydration and list updates. */
async function verifiesPublishedForHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the package server entry. */
    () => renderForHydrationTree(components),
  );
  expect(markup).toContain('No items');
  expect(markup).toContain('hydrated-for-alpha');
  expect(markup).toContain('hydrated-for-beta');
  expect(markup).not.toContain('hydrated-for-one');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(`${generateHydrationScript()}<div id="for-hydration-root">${markup}</div>`);
  const stable = page.getByTestId('for-hydration-stable');
  const fallback = page.getByTestId('for-hydration-fallback');
  const initialAlpha = page.getByTestId('hydrated-for-alpha');
  await stable.evaluate(
    /** Mark the server sibling to detect replacement. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  await fallback.evaluate(
    /** Mark the server fallback to detect replacement during hydration. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  await initialAlpha.evaluate(
    /** Mark a populated server item to verify keyed hydration reuse. */
    (element) => {
      (element as HTMLElement).dataset.serverElement = 'true';
    },
  );
  const errors: string[] = [];

  /** Record hydration failures reported by the browser. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateForInBrowser);
  await expect(page.locator('#for-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(stable).toHaveAttribute('data-server-element', 'true');
  await expect(fallback).toHaveAttribute('data-server-element', 'true');
  await expect(initialAlpha).toHaveAttribute('data-server-element', 'true');
  await page.getByTestId('for-hydration-reverse').click();
  await expect(page.getByTestId('for-hydration-initial-list').locator(':scope > li')).toHaveText([
    '0: Beta',
    '1: Alpha',
  ]);
  await expect(initialAlpha).toHaveAttribute('data-server-element', 'true');
  await expect(initialAlpha).toHaveText('1: Alpha');
  await page.getByTestId('for-hydration-reveal').click();
  await expect(fallback).toHaveCount(0);
  await expect(page.getByTestId('hydrated-for-one')).toHaveText('0: One');
  await expect(page.getByTestId('hydrated-for-two')).toHaveText('1: Two');
  await expect(stable).toHaveAttribute('data-server-element', 'true');
  expect(errors).toEqual([]);
}

test('published For hydrates its fallback and reveals a keyed list', verifiesPublishedForHydration);
