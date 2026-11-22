import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { AccordionHydrationComponents } from '../../.storybook/accordion-hydration-tree';
import { renderAccordionHydrationTree } from '../../.storybook/accordion-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as AccordionHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark a server node before hydration so replacement is observable. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the published tree using the browser entry. */
async function hydrateInBrowser(initiallyOpen: boolean): Promise<void> {
  const modulePath = '/.storybook/accordion-hydration-example.tsx';
  const { hydrateAccordionExample } = await import(modulePath);
  const root = document.getElementById('accordion-hydration-root');
  if (!root) throw new Error('Accordion hydration root was not found.');
  hydrateAccordionExample(root, initiallyOpen);
}

/** Verify server nodes, accessible IDs, styles, and disclosure after hydration. */
async function verifiesHydration(page: Page, initiallyOpen: boolean): Promise<void> {
  const markup = renderToString(
    /** Render the same initial value that the browser will hydrate. */
    () => renderAccordionHydrationTree(components, initiallyOpen),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="accordion-hydration-root">${markup}</div>`,
  );
  const trigger = page.getByTestId('hydrated-accordion-trigger');
  const panel = page.getByTestId('hydrated-accordion-content');
  const triggerId = await trigger.getAttribute('id');
  if (!triggerId) throw new Error('Server trigger has no ID.');
  await trigger.evaluate(markServerNode);
  if (initiallyOpen) await panel.evaluate(markServerNode);
  const errors: string[] = [];

  /** Collect errors raised while Solid attaches to the server nodes. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser, initiallyOpen);
  await expect(page.locator('#accordion-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(trigger).toHaveAttribute('data-server-node', 'true');
  await expect(trigger).toHaveAttribute('id', triggerId);

  if (initiallyOpen) {
    await expect(panel).toHaveAttribute('data-server-node', 'true');
    const panelId = await panel.getAttribute('id');
    if (!panelId) throw new Error('Open server panel has no ID.');
    await expect(trigger).toHaveAttribute('aria-controls', panelId);
    await trigger.click();
    await expect(panel).toHaveCount(0);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  } else {
    await expect(panel).toHaveCount(0);
    await expect(trigger).not.toHaveAttribute('aria-controls');
    await trigger.click();
    await expect(panel).toBeVisible();
    const panelId = await panel.getAttribute('id');
    if (!panelId) throw new Error('Opened panel has no ID.');
    await expect(trigger).toHaveAttribute('aria-controls', panelId);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  }
}

/** Hydrate closed server markup and lazily reveal its panel. */
async function verifiesClosedHydration({ page }: { page: Page }): Promise<void> {
  await verifiesHydration(page, false);
}

/** Hydrate an open panel and unmount it through the original trigger. */
async function verifiesOpenHydration({ page }: { page: Page }): Promise<void> {
  await verifiesHydration(page, true);
}

test('published closed Accordion hydrates and opens lazily', verifiesClosedHydration);
test('published open Accordion hydrates and unmounts on exit', verifiesOpenHydration);
