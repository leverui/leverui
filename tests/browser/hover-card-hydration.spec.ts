import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { HoverCardHydrationComponents } from '../../.storybook/hover-card-hydration-tree';
import { renderHoverCardHydrationTree } from '../../.storybook/hover-card-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as HoverCardHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a published node so replacement during hydration is observable. */
function markServerElement(element: Element): void {
  element.setAttribute('data-server-element', 'true');
}

/** Check whether a portalled element remains inside the original server root. */
function isInsideServerRoot(element: Element): boolean {
  return element.closest('#hover-hydration-root') !== null;
}

/** Hydrate source components against published Hover Card markup. */
async function hydrateHoverCardInBrowser(initialOpen: boolean): Promise<void> {
  const modulePath = '/.storybook/hover-card-hydration-example.tsx';
  const { hydrateHoverCardExample } = await import(modulePath);
  const root = document.getElementById('hover-hydration-root');
  if (!root) throw new Error('Hover Card hydration root was not found.');
  hydrateHoverCardExample(root, initialOpen);
}

/** Load installed server markup and a consumer CSS token override. */
async function loadServerMarkup(page: Page, initialOpen: boolean): Promise<void> {
  const markup = renderToString(
    /** Render the same tree through the public server entry. */
    () => renderHoverCardHydrationTree(components, initialOpen),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>:root{--lui-colors-bg-panel:rgb(12,34,56)}</style><div id="hover-hydration-root">${markup}</div>`,
  );
}

/** Verify closed server markup keeps its trigger and opens a hydrated portal. */
async function verifiesClosedHydration({ page }: { page: Page }): Promise<void> {
  await loadServerMarkup(page, false);
  const trigger = page.getByTestId('hydrated-hover-trigger');
  const content = page.getByTestId('hydrated-hover-content');
  // Zag 2 gives unreferenced parts no `id`; the scoped part attribute keeps the server ID.
  const triggerId = await trigger.getAttribute('data-hover-card-trigger');
  if (!triggerId) throw new Error('Published Hover Card trigger has no ID.');
  await expect(content).toHaveCount(0);
  await trigger.evaluate(markServerElement);
  const errors: string[] = [];

  /** Record browser errors while Solid hydrates the Hover Card. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateHoverCardInBrowser, false);
  await expect(page.locator('#hover-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(trigger).toHaveAttribute('data-server-element', 'true');
  await expect(trigger).toHaveAttribute('data-hover-card-trigger', triggerId);
  await trigger.hover();
  await expect(content).toBeVisible();
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  expect(await content.evaluate(isInsideServerRoot)).toBe(false);
  await content.hover();
  await page.mouse.move(900, 600);
  await expect(content).toHaveCount(0);
  expect(errors).toEqual([]);
}

test('published closed Hover Card hydrates into a working portal', verifiesClosedHydration);

/** Verify open published markup keeps its node and theme across hydration. */
async function verifiesOpenHydration({ page }: { page: Page }): Promise<void> {
  await loadServerMarkup(page, true);
  const trigger = page.getByTestId('hydrated-hover-trigger');
  const content = page.getByTestId('hydrated-hover-content');
  await expect(content).toBeVisible();
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Published Hover Card content has no ID.');
  await content.evaluate(markServerElement);
  const errors: string[] = [];

  /** Record browser errors while Solid moves the existing surface. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateHoverCardInBrowser, true);
  await expect(page.locator('#hover-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(content).toHaveAttribute('data-server-element', 'true');
  await expect(content).toHaveAttribute('id', contentId);
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  expect(await content.evaluate(isInsideServerRoot)).toBe(false);
  await trigger.hover();
  await content.hover();
  await page.mouse.move(900, 600);
  await expect(content).toHaveCount(0);
  expect(errors).toEqual([]);
}

test('published open Hover Card preserves its surface during hydration', verifiesOpenHydration);
