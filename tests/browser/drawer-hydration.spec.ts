import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { DrawerHydrationComponents } from '../../.storybook/drawer-hydration-tree';
import { renderDrawerHydrationTree } from '../../.storybook/drawer-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as DrawerHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark the server trigger so a later assertion detects replacement. */
function markServerTrigger(element: Element): void {
  element.setAttribute('data-server-element', 'true');
}

/** Check whether the browser's active element remains inside Drawer content. */
function hasDrawerFocus(element: Element): boolean {
  return element.contains(document.activeElement);
}

/** Hydrate the published Drawer tree inside Storybook's browser runtime. */
async function hydrateDrawerInBrowser(initialOpen = false): Promise<void> {
  const modulePath = '/.storybook/drawer-hydration-example.tsx';
  const { hydrateDrawerExample } = await import(modulePath);
  const root = document.getElementById('drawer-hydration-root');
  if (!root) throw new Error('Drawer hydration root was not found.');
  hydrateDrawerExample(root, initialOpen);
}

/** Verify the original server trigger controls portalled content after hydration. */
async function verifiesDrawerHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the identical tree through the published server entry. */
    () => renderDrawerHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="drawer-hydration-root">${markup}</div>`,
  );
  const trigger = page.getByTestId('hydrated-drawer-trigger');
  const serverId = await trigger.getAttribute('id');
  if (!serverId) throw new Error('Published Drawer trigger has no ID.');
  await expect(trigger).not.toHaveAttribute('aria-controls');
  await expect(trigger).toHaveAttribute('data-lui-drawer-css', '');
  await trigger.evaluate(markServerTrigger);
  const errors: string[] = [];

  /** Collect errors raised while Solid attaches to the server nodes. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateDrawerInBrowser, false);
  await expect(page.locator('#drawer-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(trigger).toHaveAttribute('data-server-element', 'true');
  await expect(trigger).toHaveAttribute('id', serverId);

  await trigger.click();
  const content = page.getByTestId('hydrated-drawer-content');
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('data-lui-drawer-css', '');
  await expect(content).toHaveAttribute('aria-labelledby', /.+/);
  await expect(content).toHaveAttribute('aria-describedby', /.+/);
  await expect(page.locator('#hydrated-drawer-backdrop')).toBeVisible();
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Hydrated Drawer content has no ID.');
  await expect(trigger).toHaveAttribute('aria-controls', contentId);
  await content.getByRole('button', { name: 'Close hydrated drawer' }).click();
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('data-server-element', 'true');
}

test('published Drawer trigger hydrates and controls a portal', verifiesDrawerHydration);

/** Verify initially open server content survives hydration and moves into a portal. */
async function verifiesInitiallyOpenDrawerHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the initially open tree through the published server entry. */
    () => renderDrawerHydrationTree(components, true),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>:root{--lui-colors-bg-panel:rgb(12,34,56)}</style><div id="drawer-hydration-root">${markup}</div>`,
  );

  const root = page.locator('#drawer-hydration-root');
  const trigger = page.getByTestId('hydrated-drawer-trigger');
  const content = page.getByTestId('hydrated-drawer-content');
  const title = page.getByText('Hydrated drawer title');
  const description = page.getByText('Hydrated drawer description');
  await expect(root.getByRole('dialog')).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const contentId = await content.getAttribute('id');
  const titleId = await title.getAttribute('id');
  const descriptionId = await description.getAttribute('id');
  if (!contentId || !titleId || !descriptionId) {
    throw new Error('Published open Drawer is missing an accessible ID.');
  }
  await expect(trigger).toHaveAttribute('aria-controls', contentId);
  await expect(content).toHaveAttribute('aria-labelledby', titleId);
  await expect(content).toHaveAttribute('aria-describedby', descriptionId);
  await expect(content).toHaveAttribute('data-lui-drawer-css', '');
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  const errors: string[] = [];

  /** Capture errors while Solid hydrates and moves the open content. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateDrawerInBrowser, true);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('id', contentId);
  await expect(content).toHaveAttribute('aria-labelledby', titleId);
  await expect(content).toHaveAttribute('aria-describedby', descriptionId);
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  expect(await content.evaluate(hasDrawerFocus)).toBe(true);
  const input = content.getByRole('textbox', { name: 'Hydrated drawer input' });
  const close = content.getByRole('button', { name: 'Close hydrated drawer' });
  await close.focus();
  await page.keyboard.press('Tab');
  await expect(input).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  /** Confirm the visible Drawer is no longer inside the server root. */
  function isInsideServerRoot(element: Element): boolean {
    return element.closest('#drawer-hydration-root') !== null;
  }

  expect(await content.evaluate(isInsideServerRoot)).toBe(false);
  expect(errors).toEqual([]);
  await close.click();
  await expect(content).toHaveCount(0);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
}

test(
  'published initially open Drawer hydrates into a working portal',
  verifiesInitiallyOpenDrawerHydration,
);
