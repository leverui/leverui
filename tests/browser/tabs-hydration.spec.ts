import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { TabsHydrationComponents } from '../../.storybook/tabs-hydration-tree';
import { renderTabsHydrationTree } from '../../.storybook/tabs-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as TabsHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Mark an original server node so replacement is visible after hydration. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-element', 'true');
}

/** Hydrate the published Tabs markup through Storybook's browser runtime. */
async function hydrateTabsInBrowser(): Promise<void> {
  const modulePath = '/.storybook/tabs-hydration-example.tsx';
  const { hydrateTabsExample } = await import(modulePath);
  const root = document.getElementById('tabs-hydration-root');
  if (!root) throw new Error('Tabs hydration root was not found.');
  hydrateTabsExample(root);
}

/** Verify SSR nodes and IDs survive hydration and keyboard selection works. */
async function verifiesTabsHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree from the published server entry. */
    () => renderTabsHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="tabs-hydration-root">${markup}</div>`,
  );
  const root = page.locator('.lui-tabs__root');
  const one = page.getByTestId('hydrated-tab-one');
  const two = page.getByTestId('hydrated-tab-two');
  const firstPanel = page.getByTestId('hydrated-panel-one');
  // Zag 2 gives the root no `id`; its scoped part attribute keeps the server ID.
  const rootId = await root.getAttribute('data-tabs-root');
  const triggerId = await one.getAttribute('id');
  const panelId = await firstPanel.getAttribute('id');
  if (!rootId || !triggerId || !panelId) throw new Error('Published Tabs IDs are missing.');
  await expect(one).toHaveAttribute('aria-selected', 'true');
  await expect(one).toHaveAttribute('aria-controls', panelId);
  await expect(firstPanel).toHaveAttribute('aria-labelledby', triggerId);
  await expect(firstPanel).toBeVisible();
  await expect(one).toHaveCSS('height', '36px');
  await root.evaluate(markServerNode);
  await one.evaluate(markServerNode);
  await firstPanel.evaluate(markServerNode);
  const errors: string[] = [];

  /** Capture errors raised while Solid attaches to the server nodes. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateTabsInBrowser);
  await expect(page.locator('#tabs-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(root).toHaveAttribute('data-server-element', 'true');
  await expect(root).toHaveAttribute('data-tabs-root', rootId);
  await expect(one).toHaveAttribute('data-server-element', 'true');
  await expect(one).toHaveAttribute('id', triggerId);
  await expect(firstPanel).toHaveAttribute('data-server-element', 'true');
  await expect(firstPanel).toHaveAttribute('id', panelId);
  await expect(firstPanel).toHaveAttribute('aria-labelledby', triggerId);

  await one.focus();
  await page.keyboard.press('ArrowRight');
  await expect(two).toBeFocused();
  await expect(two).toHaveAttribute('aria-selected', 'true');
  const secondPanel = page.getByTestId('hydrated-panel-two');
  const secondPanelId = await secondPanel.getAttribute('id');
  const secondTriggerId = await two.getAttribute('id');
  if (!secondPanelId || !secondTriggerId) throw new Error('Hydrated second tab IDs are missing.');
  await expect(two).toHaveAttribute('aria-controls', secondPanelId);
  await expect(secondPanel).toHaveAttribute('aria-labelledby', secondTriggerId);
  await expect(secondPanel).toBeVisible();
  await expect(firstPanel).toBeHidden();
  expect(errors).toEqual([]);
}

test(
  'published Tabs hydrate without replacement and keep keyboard selection',
  verifiesTabsHydration,
);

/** Verify the server's selected Tabs presentation without injected runtime CSS. */
async function verifiesTabsWithoutRuntimeStyles({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the published component tree before any browser code runs. */
    () => renderTabsHydrationTree(components),
  );
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const root = page.locator('.lui-tabs__root');
  await expect(root).toHaveAttribute('data-size', 'sm');
  await expect(root).toHaveAttribute('data-variant', 'subtle');
  await expect(root).toHaveAttribute('data-variant-md', 'plain');
  await expect(page.getByTestId('hydrated-tab-one')).toHaveCSS('height', '36px');
  await page.setViewportSize({ width: 400, height: 800 });
  await expect(page.getByTestId('hydrated-tab-one')).not.toHaveCSS(
    'background-color',
    'rgba(0, 0, 0, 0)',
  );
  const subtleBackground = await page.getByTestId('hydrated-tab-one').evaluate(
    /** Capture the selected surface before the plain breakpoint applies. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.setViewportSize({ width: 800, height: 800 });
  await expect(page.getByTestId('hydrated-tab-one')).not.toHaveCSS(
    'background-color',
    subtleBackground,
  );
  await expect(page.getByTestId('hydrated-panel-one')).toBeVisible();
}

test(
  'server-rendered Tabs use authored CSS without runtime styles',
  verifiesTabsWithoutRuntimeStyles,
);
