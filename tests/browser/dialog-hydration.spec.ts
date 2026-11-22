import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { DialogHydrationComponents } from '../../.storybook/dialog-hydration-tree';
import { renderDialogHydrationTree } from '../../.storybook/dialog-hydration-tree';
import type { DialogRootProps } from '../../src';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as DialogHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark the server trigger so a later assertion detects replacement. */
function markServerTrigger(element: Element): void {
  element.setAttribute('data-server-element', 'true');
}

/** Check whether the browser's active element remains inside Dialog content. */
function hasDialogFocus(element: Element): boolean {
  return element.contains(document.activeElement);
}

/** Hydrate the published Dialog tree inside Storybook's browser runtime. */
async function hydrateDialogInBrowser(
  options: boolean | { initialOpen: boolean; size: DialogRootProps['size'] } = false,
): Promise<void> {
  const initialOpen = typeof options === 'boolean' ? options : options.initialOpen;
  const size = typeof options === 'boolean' ? undefined : options.size;
  const modulePath = '/.storybook/dialog-hydration-example.tsx';
  const { hydrateDialogExample } = await import(modulePath);
  const root = document.getElementById('dialog-hydration-root');
  if (!root) throw new Error('Dialog hydration root was not found.');
  hydrateDialogExample(root, initialOpen, size);
}

/** Verify the original server trigger controls portalled content after hydration. */
async function verifiesDialogHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the identical tree through the published server entry. */
    () => renderDialogHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="dialog-hydration-root">${markup}</div>`,
  );
  const trigger = page.getByTestId('hydrated-dialog-trigger');
  const serverId = await trigger.getAttribute('id');
  if (!serverId) throw new Error('Published Dialog trigger has no ID.');
  await expect(trigger).not.toHaveAttribute('aria-controls');
  await trigger.evaluate(markServerTrigger);
  const errors: string[] = [];

  /** Collect errors raised while Solid attaches to the server nodes. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateDialogInBrowser, false);
  await expect(page.locator('#dialog-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(trigger).toHaveAttribute('data-server-element', 'true');
  await expect(trigger).toHaveAttribute('id', serverId);

  await trigger.click();
  const content = page.getByTestId('hydrated-dialog-content');
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('aria-labelledby', /.+/);
  await expect(content).toHaveAttribute('aria-describedby', /.+/);
  await expect(page.locator('#hydrated-dialog-backdrop')).toBeVisible();
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Hydrated Dialog content has no ID.');
  await expect(trigger).toHaveAttribute('aria-controls', contentId);
  await content.getByRole('button', { name: 'Close hydrated dialog' }).click();
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('data-server-element', 'true');
}

test('published Dialog trigger hydrates and controls a portal', verifiesDialogHydration);

/** Verify initially open server content survives hydration and moves into a portal. */
async function verifiesInitiallyOpenDialogHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the initially open tree through the published server entry. */
    () => renderDialogHydrationTree(components, true),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>:root{--leverui-colors-bg-panel:rgb(12,34,56)}</style><div id="dialog-hydration-root">${markup}</div>`,
  );

  const root = page.locator('#dialog-hydration-root');
  const trigger = page.getByTestId('hydrated-dialog-trigger');
  const content = page.getByTestId('hydrated-dialog-content');
  const title = page.getByText('Hydrated dialog title');
  const description = page.getByText('Hydrated dialog description');
  await expect(root.getByRole('dialog')).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const contentId = await content.getAttribute('id');
  const titleId = await title.getAttribute('id');
  const descriptionId = await description.getAttribute('id');
  if (!contentId || !titleId || !descriptionId) {
    throw new Error('Published open Dialog is missing an accessible ID.');
  }
  await expect(trigger).toHaveAttribute('aria-controls', contentId);
  await expect(content).toHaveAttribute('aria-labelledby', titleId);
  await expect(content).toHaveAttribute('aria-describedby', descriptionId);
  await expect(content).toHaveAttribute('data-leverui-dialog-css', '');
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  await expect(content).toHaveCSS('max-width', '512px');
  await expect(page.locator('.leverui-dialog__positioner')).toHaveCSS('align-items', 'center');
  const errors: string[] = [];

  /** Capture errors while Solid hydrates and moves the open content. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateDialogInBrowser, true);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('id', contentId);
  await expect(content).toHaveAttribute('aria-labelledby', titleId);
  await expect(content).toHaveAttribute('aria-describedby', descriptionId);
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  expect(await content.evaluate(hasDialogFocus)).toBe(true);
  const input = content.getByRole('textbox', { name: 'Hydrated dialog input' });
  const close = content.getByRole('button', { name: 'Close hydrated dialog' });
  await close.focus();
  await page.keyboard.press('Tab');
  await expect(input).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  /** Confirm the visible Dialog is no longer inside the server root. */
  function isInsideServerRoot(element: Element): boolean {
    return element.closest('#dialog-hydration-root') !== null;
  }

  expect(await content.evaluate(isInsideServerRoot)).toBe(false);
  expect(errors).toEqual([]);
  await close.click();
  await expect(content).toHaveCount(0);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
}

test(
  'published initially open Dialog hydrates into a working portal',
  verifiesInitiallyOpenDialogHydration,
);

/** Hydrate responsive CSS and keep the same portal through a viewport change. */
async function verifiesResponsiveDialogHydration({ page }: { page: Page }): Promise<void> {
  const size = { mdDown: 'full', md: 'lg' } as const;
  const markup = renderToString(
    /** Render the same responsive tree through the published server entry. */
    () => renderDialogHydrationTree(components, true, size),
  );
  await page.setViewportSize({ width: 700, height: 700 });
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="dialog-hydration-root">${markup}</div>`,
  );
  const content = page.getByTestId('hydrated-dialog-content');
  const id = await content.getAttribute('id');
  if (!id) throw new Error('Server-rendered responsive Dialog has no content ID.');
  await expect(content).toHaveAttribute('data-size-md-down', 'full');
  await expect(content).toHaveAttribute('data-size-md', 'lg');
  await expect(content).toHaveCSS('max-width', '700px');

  await page.evaluate(hydrateDialogInBrowser, { initialOpen: true, size });
  await expect(page.locator('#dialog-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(content).toHaveAttribute('id', id);
  await page.setViewportSize({ width: 1024, height: 700 });
  await expect(content).toHaveCSS('max-width', '672px');
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
}

test(
  'responsive Dialog CSS survives server rendering and hydration',
  verifiesResponsiveDialogHydration,
);
