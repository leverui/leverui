import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { Show as ShowExport } from '../../src';
import {
  renderShowHydrationTree,
  type ShowHydrationOptions,
} from '../../.storybook/show-hydration-tree';

type ServerExports = { Show: typeof ShowExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerExports;

/** Place published server markup into the Storybook browser host. */
async function mountServerTree(page: Page, options: ShowHydrationOptions): Promise<string> {
  const markup = renderToString(
    /** Render the same initial condition that the browser will hydrate. */
    () => renderShowHydrationTree(server.Show, options),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<div id="show-hydration-root">${markup}</div>`,
  );
  return markup;
}

/** Load the client Show module after inserting the published server HTML. */
async function hydrateShowInBrowser(options: ShowHydrationOptions): Promise<void> {
  const modulePath = '/.storybook/show-hydration-example.tsx';
  const { hydrateShowExample } = await import(modulePath);
  const root = document.getElementById('show-hydration-root');
  if (!root) throw new Error('Show hydration root was not found.');
  hydrateShowExample(root, options);
}

/** Keep a truthy server node while its narrowed value changes. */
async function verifiesTruthyShowHydration({ page }: { page: Page }): Promise<void> {
  const options = { initialValue: 'Alpha' };
  const markup = await mountServerTree(page, options);
  expect(markup).toContain('Alpha');
  expect(markup).not.toContain('Missing');
  const value = page.getByTestId('show-hydrated-value');
  await value.evaluate(
    /** Tag the server node before client code runs. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  const errors: string[] = [];

  /** Collect hydration and transition exceptions. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateShowInBrowser, options);
  await expect(page.locator('#show-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(value).toHaveAttribute('data-server-node', 'true');
  await page.getByTestId('show-update').click();
  await expect(value).toHaveText('Beta');
  await expect(value).toHaveAttribute('data-server-node', 'true');
  await page.getByTestId('show-hide').click();
  await expect(value).toHaveCount(0);
  await expect(page.getByTestId('show-hydrated-fallback')).toBeVisible();
  expect(errors).toEqual([]);
}

/** Keep a fallback server node, then enter and update the truthy branch. */
async function verifiesFallbackShowHydration({ page }: { page: Page }): Promise<void> {
  const options = { initialValue: undefined };
  const markup = await mountServerTree(page, options);
  expect(markup).toContain('Missing');
  const fallback = page.getByTestId('show-hydrated-fallback');
  await fallback.evaluate(
    /** Tag the fallback node before client code runs. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  const errors: string[] = [];

  /** Collect hydration and branch-switch exceptions. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateShowInBrowser, options);
  await expect(fallback).toHaveAttribute('data-server-node', 'true');
  await page.getByTestId('show-reveal').click();
  const value = page.getByTestId('show-hydrated-value');
  await expect(value).toHaveText('Alpha');
  await expect(fallback).toHaveCount(0);
  await value.evaluate(
    /** Mark the mounted truthy node before a value update. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await page.getByTestId('show-update').click();
  await expect(value).toHaveText('Beta');
  await expect(value).toHaveAttribute('data-original-node', 'true');
  expect(errors).toEqual([]);
}

test('published Show hydrates its truthy branch and live value', verifiesTruthyShowHydration);
test('published Show hydrates fallback before revealing content', verifiesFallbackShowHydration);
