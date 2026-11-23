import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { TabsProviderHydrationComponents } from '../../.storybook/tabs-provider-hydration-tree';
import { renderTabsProviderHydrationTree } from '../../.storybook/tabs-provider-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as TabsProviderHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Tag an existing server node to detect replacement during hydration. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-element', 'true');
}

/** Hydrate the matching browser tree after the published server render. */
async function hydrateProviderTabs(): Promise<void> {
  const modulePath = '/.storybook/tabs-provider-hydration-example.tsx';
  const { hydrateTabsProviderExample } = await import(modulePath);
  const target = document.getElementById('tabs-provider-hydration-root');
  if (!target) throw new Error('Provider Tabs hydration target is missing.');
  hydrateTabsProviderExample(target);
}

/** Verify an external machine retains IDs, nodes, styles, and selection. */
async function verifiesProviderHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree from published server components. */
    () => renderTabsProviderHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    generateHydrationScript() +
      '<style>' +
      defaultCss +
      '</style><div id="tabs-provider-hydration-root">' +
      markup +
      '</div>',
  );
  const root = page.getByTestId('provider-hydrated-root');
  const one = page.getByTestId('provider-hydrated-tab-one');
  const two = page.getByTestId('provider-hydrated-tab-two');
  const panel = page.getByTestId('provider-hydrated-panel-one');
  const group = page.getByTestId('provider-hydrated-group');
  // Zag 2 gives the root no `id`; its scoped part attribute keeps the server ID.
  const rootId = await root.getAttribute('data-tabs-root');
  const triggerId = await one.getAttribute('id');
  const panelId = await panel.getAttribute('id');
  if (!rootId || !triggerId || !panelId) throw new Error('Published provider IDs are missing.');
  await expect(one).toHaveAttribute('aria-selected', 'true');
  await expect(one).toHaveAttribute('aria-controls', panelId);
  await expect(panel).toHaveAttribute('aria-labelledby', triggerId);
  await expect(group).toHaveClass(/lui-tabs__contentGroup/);
  await expect(panel).toBeVisible();
  await root.evaluate(markServerNode);
  await one.evaluate(markServerNode);
  await panel.evaluate(markServerNode);
  const errors: string[] = [];

  /** Capture runtime errors raised while Solid attaches to server nodes. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateProviderTabs);
  await expect(page.locator('#tabs-provider-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  expect(errors).toEqual([]);
  await expect(root).toHaveAttribute('data-server-element', 'true');
  await expect(root).toHaveAttribute('data-tabs-root', rootId);
  await expect(one).toHaveAttribute('data-server-element', 'true');
  await expect(one).toHaveAttribute('id', triggerId);
  await expect(panel).toHaveAttribute('data-server-element', 'true');
  await expect(panel).toHaveAttribute('id', panelId);
  await two.click();
  await expect(two).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('provider-hydrated-panel-two')).toBeVisible();
  expect(errors).toEqual([]);
}

test('published external Tabs machine hydrates without replacement', verifiesProviderHydration);
