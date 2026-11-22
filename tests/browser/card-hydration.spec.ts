import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderCardHydrationTree,
  type CardHydrationComponents,
} from '../../.storybook/card-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as CardHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser behavior to the existing server-rendered Card. */
async function hydrateCardInBrowser(): Promise<void> {
  const modulePath = '/.storybook/card-hydration-example.tsx';
  const { hydrateCardExample } = await import(modulePath);
  const root = document.getElementById('card-hydration-root');
  if (!root) throw new Error('Card hydration root was not found.');
  hydrateCardExample(root);
}

/** Verify Card node identity, styles, and reactivity after hydration. */
async function verifiesCardHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the published server entry before attaching browser behavior. */
    () => renderCardHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="card-hydration-root">${markup}</div>`,
  );
  const card = page.locator('#hydrated-card');
  await expect(card.locator('h3')).toHaveText('A card');
  await expect(card.locator('div')).toHaveCSS('padding-top', '16px');
  await card.evaluate(
    /** Mark the server node before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect browser failures during hydration and the size change. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateCardInBrowser);
  await expect(page.locator('#card-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(card).toHaveAttribute('data-server-node', 'true');
  await page.locator('#card-hydration-toggle').click();
  await expect(card.locator('div')).toHaveCSS('padding-top', '28px');
  expect(errors).toEqual([]);
}

test('published Card hydrates without replacing its root', verifiesCardHydration);
