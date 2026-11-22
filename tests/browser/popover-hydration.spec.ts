import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { PopoverHydrationComponents } from '../../.storybook/popover-hydration-tree';
import { renderPopoverHydrationTree } from '../../.storybook/popover-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as PopoverHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark an installed server node so replacement is observable. */
function markServerElement(element: Element): void {
  element.setAttribute('data-server-element', 'true');
}

/** Check whether a portalled element stayed under the server root. */
function isInsideServerRoot(element: Element): boolean {
  return element.closest('#popover-hydration-root') !== null;
}

/** Hydrate source components against published Popover markup. */
async function hydratePopoverInBrowser(initialOpen: boolean): Promise<void> {
  const modulePath = '/.storybook/popover-hydration-example.tsx';
  const { hydratePopoverExample } = await import(modulePath);
  const root = document.getElementById('popover-hydration-root');
  if (!root) throw new Error('Popover hydration root was not found.');
  hydratePopoverExample(root, initialOpen);
}

/** Load installed server markup and a consumer CSS token override. */
async function loadServerMarkup(page: Page, initialOpen: boolean): Promise<void> {
  const markup = renderToString(
    /** Render the same tree through the public server entry. */
    () => renderPopoverHydrationTree(components, initialOpen),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>:root{--leverui-colors-bg-panel:rgb(12,34,56)}</style><div id="popover-hydration-root">${markup}</div>`,
  );
}

/** Verify closed server markup retains its trigger and opens a portal. */
async function verifiesClosedHydration({ page }: { page: Page }): Promise<void> {
  await loadServerMarkup(page, false);
  const trigger = page.getByTestId('hydrated-popover-trigger');
  const content = page.getByTestId('hydrated-popover-content');
  // Zag 2 gives unreferenced parts no `id`; the scoped part attribute keeps the server ID.
  const triggerId = await trigger.getAttribute('data-popover-trigger');
  if (!triggerId) throw new Error('Published Popover trigger has no ID.');
  await expect(content).toHaveCount(0);
  await trigger.evaluate(markServerElement);
  const errors: string[] = [];

  /** Record browser errors while Solid hydrates the Popover. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydratePopoverInBrowser, false);
  await expect(page.locator('#popover-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(trigger).toHaveAttribute('data-server-element', 'true');
  await expect(trigger).toHaveAttribute('data-popover-trigger', triggerId);
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  expect(await content.evaluate(isInsideServerRoot)).toBe(false);
  await page.getByTestId('hydrated-popover-close').click();
  await expect(content).toHaveCount(0);
  expect(errors).toEqual([]);
}

test('published closed Popover hydrates into a working portal', verifiesClosedHydration);

/** Verify open markup keeps its content node and theme during hydration. */
async function verifiesOpenHydration({ page }: { page: Page }): Promise<void> {
  await loadServerMarkup(page, true);
  const trigger = page.getByTestId('hydrated-popover-trigger');
  const content = page.getByTestId('hydrated-popover-content');
  await expect(content).toBeVisible();
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Published Popover content has no ID.');
  await content.evaluate(markServerElement);
  const errors: string[] = [];

  /** Record browser errors while Solid moves the existing surface. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydratePopoverInBrowser, true);
  await expect(page.locator('#popover-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(content).toHaveAttribute('data-server-element', 'true');
  await expect(content).toHaveAttribute('id', contentId);
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  expect(await content.evaluate(isInsideServerRoot)).toBe(false);
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
}

test('published open Popover retains its surface during hydration', verifiesOpenHydration);
