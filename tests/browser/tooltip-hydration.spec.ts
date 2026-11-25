import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { TooltipHydrationComponents } from '../../.storybook/tooltip-hydration-tree';
import { renderTooltipHydrationTree } from '../../.storybook/tooltip-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as TooltipHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark an installed server element so replacement is observable. */
function markServerElement(element: Element): void {
  element.setAttribute('data-server-element', 'true');
}

/** Check whether the portalled surface stayed beneath the server root. */
function isInsideServerRoot(element: Element): boolean {
  return element.closest('#tooltip-hydration-root') !== null;
}

/** Hydrate source components against published Tooltip markup. */
async function hydrateTooltipInBrowser(initialOpen: boolean): Promise<void> {
  const modulePath = '/.storybook/tooltip-hydration-example.tsx';
  const { hydrateTooltipExample } = await import(modulePath);
  const root = document.getElementById('tooltip-hydration-root');
  if (!root) throw new Error('Tooltip hydration root was not found.');
  hydrateTooltipExample(root, initialOpen);
}

/** Load published server markup under a consumer CSS token override. */
async function loadServerMarkup(page: Page, initialOpen: boolean): Promise<void> {
  const markup = renderToString(
    /** Render the same tree through the public server entry. */
    () => renderTooltipHydrationTree(components, initialOpen),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>:root{--lui-colors-bg-inverted:rgb(12,34,56)}</style><div id="tooltip-hydration-root">${markup}</div>`,
  );
}

/** Preserve a closed trigger and activate its portalled content after hydration. */
async function verifiesClosedHydration({ page }: { page: Page }): Promise<void> {
  await loadServerMarkup(page, false);
  const trigger = page.getByTestId('hydrated-tooltip-trigger');
  const content = page.getByTestId('hydrated-tooltip-content');
  // Zag 2 gives unreferenced parts no `id`; the scoped part attribute keeps the server ID.
  const triggerId = await trigger.getAttribute('data-tooltip-trigger');
  if (!triggerId) throw new Error('Published Tooltip trigger has no ID.');
  await expect(content).toHaveCount(0);
  await trigger.evaluate(markServerElement);
  const errors: string[] = [];

  /** Record browser errors while Solid hydrates the Tooltip. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateTooltipInBrowser, false);
  await expect(page.locator('#tooltip-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(trigger).toHaveAttribute('data-server-element', 'true');
  await expect(trigger).toHaveAttribute('data-tooltip-trigger', triggerId);
  await trigger.hover();
  await expect(content).toBeVisible();
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  expect(await content.evaluate(isInsideServerRoot)).toBe(false);
  // Linux Chromium sends no pointerleave on a setContent page, so close with Escape;
  // tooltip.spec.ts covers closing on pointer leave.
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  expect(errors).toEqual([]);
}

test('published closed Tooltip hydrates into a working portal', verifiesClosedHydration);

/** Preserve open content, IDs, and styling through the portal move. */
async function verifiesOpenHydration({ page }: { page: Page }): Promise<void> {
  await loadServerMarkup(page, true);
  const trigger = page.getByTestId('hydrated-tooltip-trigger');
  const content = page.getByTestId('hydrated-tooltip-content');
  await expect(trigger).toBeVisible();
  await expect(content).toBeVisible();
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Published Tooltip content has no ID.');
  await content.evaluate(markServerElement);
  const errors: string[] = [];

  /** Record browser errors while Solid moves the existing surface. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateTooltipInBrowser, true);
  await expect(page.locator('#tooltip-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(content).toHaveAttribute('data-server-element', 'true');
  await expect(content).toHaveAttribute('id', contentId);
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  expect(await content.evaluate(isInsideServerRoot)).toBe(false);
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  expect(errors).toEqual([]);
}

test('published open Tooltip retains its surface during hydration', verifiesOpenHydration);
