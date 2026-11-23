import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderBarListHydrationTree,
  type BarListHydrationComponents,
} from '../../.storybook/bar-list-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as BarListHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark one server row before hydration to detect replacement. */
function markServerRow(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Hydrate the shared Bar List through the published browser entry. */
async function hydrateBarListInBrowser(): Promise<void> {
  const modulePath = '/.storybook/bar-list-hydration-example.tsx';
  const { hydrateBarListExample } = await import(modulePath);
  const target = document.getElementById('bar-list-hydration-root');
  if (!target) throw new Error('Bar List hydration root was not found.');
  hydrateBarListExample(target);
}

/** Keep SSR nodes, authored styles, and focus behavior through hydration. */
async function verifiesBarListHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same data model through the published server entry. */
    () => renderBarListHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="bar-list-hydration-root">${markup}</div>`,
  );
  const first = page.locator('.lui-bar-list__row').first();
  await first.evaluate(markServerRow);
  await expect(first).toHaveCSS('min-height', '40px');
  const errors: string[] = [];

  /** Capture client errors while focus changes the chart highlight. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateBarListInBrowser);
  await expect(page.locator('#bar-list-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(first).toHaveAttribute('data-server-node', 'true');
  await first.focus();
  await expect(first).toHaveAttribute('data-hovered', '');
  await expect(page.locator('.lui-bar-list__tooltip')).toBeVisible();
  expect(errors).toEqual([]);
}

test('published Bar List hydrates its rows without presentation styles', verifiesBarListHydration);
