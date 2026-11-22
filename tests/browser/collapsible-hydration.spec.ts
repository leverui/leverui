import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { CollapsibleHydrationComponents } from '../../.storybook/collapsible-hydration-tree';
import { renderCollapsibleHydrationTree } from '../../.storybook/collapsible-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as CollapsibleHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark an existing server node so replacement becomes observable. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Attach the browser Collapsible tree to published server markup. */
async function hydrateInBrowser(initiallyOpen: boolean): Promise<void> {
  const modulePath = '/.storybook/collapsible-hydration-example.tsx';
  const { hydrateCollapsibleExample } = await import(modulePath);
  const root = document.getElementById('collapsible-hydration-root');
  if (!root) throw new Error('Collapsible hydration root was not found.');
  hydrateCollapsibleExample(root, initiallyOpen);
}

/** Verify node reuse, stable IDs, styles, and disclosure after hydration. */
async function verifiesHydration(page: Page, initiallyOpen: boolean): Promise<void> {
  const markup = renderToString(
    /** Render the published server parts before attaching browser behavior. */
    () => renderCollapsibleHydrationTree(components, initiallyOpen),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="collapsible-hydration-root">${markup}</div>`,
  );
  const trigger = page.getByTestId('hydrated-collapsible-trigger');
  const content = page.getByTestId('hydrated-collapsible-content');
  const triggerId = await trigger.getAttribute('id');
  if (!triggerId) throw new Error('Server Collapsible trigger has no ID.');
  await trigger.evaluate(markServerNode);
  if (initiallyOpen) await content.evaluate(markServerNode);
  const errors: string[] = [];

  /** Collect browser errors raised while Solid hydrates the server nodes. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser, initiallyOpen);
  await expect(page.locator('#collapsible-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  expect(errors).toEqual([]);
  await expect(trigger).toHaveAttribute('data-server-node', 'true');
  await expect(trigger).toHaveAttribute('id', triggerId);

  if (initiallyOpen) {
    const contentId = await content.getAttribute('id');
    if (!contentId) throw new Error('Open server Collapsible content has no ID.');
    await expect(content).toHaveAttribute('data-server-node', 'true');
    await expect(trigger).toHaveAttribute('aria-controls', contentId);
    await trigger.click();
    await expect(content).toHaveCount(0);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  } else {
    await expect(content).toHaveCount(0);
    await trigger.click();
    await expect(content).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  }
}

/** Hydrate closed server markup and open its lazily mounted content. */
async function verifiesClosedHydration({ page }: { page: Page }): Promise<void> {
  await verifiesHydration(page, false);
}

/** Hydrate an open panel and unmount it through its original trigger. */
async function verifiesOpenHydration({ page }: { page: Page }): Promise<void> {
  await verifiesHydration(page, true);
}

test('published closed Collapsible hydrates and opens', verifiesClosedHydration);
test('published open Collapsible hydrates and closes', verifiesOpenHydration);
