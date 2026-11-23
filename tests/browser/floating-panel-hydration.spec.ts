import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { FloatingPanelHydrationComponents } from '../../.storybook/floating-panel-hydration-tree';
import { renderFloatingPanelHydrationTree } from '../../.storybook/floating-panel-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as FloatingPanelHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark the server trigger so replacement during hydration is observable. */
function markServerTrigger(element: Element): void {
  element.setAttribute('data-server-element', 'true');
}

/** Check whether the portal escaped the original server root. */
function isInsideServerRoot(element: Element): boolean {
  return element.closest('#floating-hydration-root') !== null;
}

/** Hydrate the source tree against the package's published server markup. */
async function hydrateFloatingPanelInBrowser(initialOpen: boolean): Promise<void> {
  const modulePath = '/.storybook/floating-panel-hydration-example.tsx';
  const { hydrateFloatingPanelExample } = await import(modulePath);
  const root = document.getElementById('floating-hydration-root');
  if (!root) throw new Error('Floating Panel hydration root was not found.');
  hydrateFloatingPanelExample(root, initialOpen);
}

/** Load published markup into the Storybook hydration host. */
async function loadServerMarkup(page: Page, initialOpen: boolean): Promise<void> {
  const markup = renderToString(
    /** Render the same tree through the public server entry. */
    () => renderFloatingPanelHydrationTree(components, initialOpen),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>:root{--lui-colors-bg-panel:rgb(12,34,56)}</style><div id="floating-hydration-root">${markup}</div>`,
  );
}

/** Verify a closed server trigger opens and closes hydrated portal content. */
async function verifiesClosedFloatingPanelHydration({ page }: { page: Page }): Promise<void> {
  await loadServerMarkup(page, false);
  const trigger = page.getByTestId('hydrated-floating-trigger');
  const content = page.getByTestId('hydrated-floating-content');
  // Zag 2 gives unreferenced parts no `id`; the scoped part attribute keeps the server ID.
  const triggerId = await trigger.getAttribute('data-floating-panel-trigger');
  if (!triggerId) throw new Error('Published Floating Panel trigger has no ID.');
  await expect(content).toHaveCount(0);
  await trigger.evaluate(markServerTrigger);
  const errors: string[] = [];

  /** Record browser errors raised while Solid hydrates the panel. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateFloatingPanelInBrowser, false);
  await expect(page.locator('#floating-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(trigger).toHaveAttribute('data-server-element', 'true');
  await expect(trigger).toHaveAttribute('data-floating-panel-trigger', triggerId);
  await trigger.click();
  await expect(content).toBeVisible();
  const contentId = await content.getAttribute('id');
  if (!contentId) throw new Error('Hydrated Floating Panel content has no ID.');
  await expect(trigger).toHaveAttribute('aria-controls', contentId);
  expect(await content.evaluate(isInsideServerRoot)).toBe(false);
  await content.getByText('Close hydrated panel').click();
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
}

test(
  'published closed Floating Panel hydrates and controls its portal',
  verifiesClosedFloatingPanelHydration,
);

/** Verify initially open server content keeps its IDs, styles, and behavior. */
async function verifiesOpenFloatingPanelHydration({ page }: { page: Page }): Promise<void> {
  await loadServerMarkup(page, true);
  const trigger = page.getByTestId('hydrated-floating-trigger');
  const content = page.getByTestId('hydrated-floating-content');
  const title = page.getByText('Hydrated panel title');
  await expect(content).toBeVisible();
  // Zag 2 gives unreferenced parts no `id`; the scoped part attribute keeps the server ID.
  const triggerId = await trigger.getAttribute('data-floating-panel-trigger');
  const contentId = await content.getAttribute('id');
  const titleId = await title.getAttribute('id');
  if (!triggerId || !contentId || !titleId) {
    throw new Error('Published open Floating Panel is missing an accessible ID.');
  }
  await expect(trigger).toHaveAttribute('aria-controls', contentId);
  await expect(content).toHaveAttribute('aria-labelledby', titleId);
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  await trigger.evaluate(markServerTrigger);
  const errors: string[] = [];

  /** Record errors raised while Solid moves the open panel into its portal. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateFloatingPanelInBrowser, true);
  await expect(page.locator('#floating-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(content).toBeVisible();
  await expect(trigger).toHaveAttribute('data-server-element', 'true');
  await expect(trigger).toHaveAttribute('data-floating-panel-trigger', triggerId);
  await expect(content).toHaveAttribute('id', contentId);
  await expect(content).toHaveAttribute('aria-labelledby', titleId);
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  expect(await content.evaluate(isInsideServerRoot)).toBe(false);
  await content.getByText('Close hydrated panel').click();
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
}

test(
  'published open Floating Panel hydrates into a working portal',
  verifiesOpenFloatingPanelHydration,
);
