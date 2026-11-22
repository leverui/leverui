import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type {
  TabsContent as ContentExport,
  TabsList as ListExport,
  TabsRoot as RootExport,
  TabsTrigger as TriggerExport,
} from '../../src';

type ServerExports = {
  TabsRoot: typeof RootExport;
  TabsList: typeof ListExport;
  TabsTrigger: typeof TriggerExport;
  TabsContent: typeof ContentExport;
};

const serverEntry = '../../dist/server/index.js';
const { TabsRoot, TabsList, TabsTrigger, TabsContent } = (await import(
  serverEntry
)) as ServerExports;

/** Require a primitive generated ID before checking its accessible association. */
async function requiredId(locator: Locator): Promise<string> {
  const id = await locator.getAttribute('id');
  if (!id) throw new Error('Tabs part is missing an ID.');
  return id;
}

/** Verify controlled selection, IDs, disabled skipping, and reactive styling. */
async function verifiesControlledTabs({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tabs--contract');
  const one = page.getByTestId('tab-one');
  const two = page.getByTestId('tab-two');
  const disabled = page.getByTestId('tab-disabled');
  await expect(one).toBeVisible({ timeout: 30_000 });
  await expect(one).toHaveAttribute('aria-selected', 'true');
  await expect(one).toHaveAttribute('data-ref-tag', 'button');
  await expect(page.getByTestId('panel-one')).toBeVisible();
  await expect(page.getByTestId('panel-one')).toHaveAttribute('data-ref-tag', 'div');
  await expect(page.getByTestId('panel-two')).toHaveCount(0);
  const panelId = await requiredId(page.getByTestId('panel-one'));
  await expect(one).toHaveAttribute('aria-controls', panelId);
  await expect(page.getByTestId('panel-one')).toHaveAttribute(
    'aria-labelledby',
    await requiredId(one),
  );
  await expect(disabled).toBeDisabled();
  await one.focus();
  await page.keyboard.press('ArrowRight');
  await expect(two).toBeFocused();
  await expect(two).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('panel-two')).toBeVisible();
  await expect(page.getByTestId('panel-one')).toHaveCount(0);
  await expect(page.getByTestId('tabs-value')).toHaveText('two');
  await page.keyboard.press('ArrowRight');
  await expect(one).toBeFocused();
  await expect(one).toHaveAttribute('aria-selected', 'true');
  const root = page.locator('.leverui-tabs__root').first();
  // Zag 2 gives the root no `id`; its scoped part attribute keeps the machine ID.
  const rootId = await root.getAttribute('data-tabs-root');
  if (!rootId) throw new Error('Tabs root is missing its scoped part ID.');
  await expect(root).toHaveAttribute('data-ref-tag', 'div');
  await expect(one).toHaveCSS('height', '36px');
  await page.getByTestId('tabs-size-toggle').click();
  await expect(root).toHaveAttribute('data-tabs-root', rootId);
  await expect(root).toHaveAttribute('data-ref-tag', 'div');
  await expect(one).toHaveAttribute('data-ref-tag', 'button');
  await expect(page.getByTestId('panel-one')).toHaveAttribute('data-ref-tag', 'div');
  await expect(one).toHaveCSS('height', '44px');
  await expect(root).toHaveClass(/leverui-tabs__root/);
  await expect(page.getByTestId('tabs-indicator')).toHaveClass(/leverui-tabs__indicator/);
}

/** Verify vertical manual navigation moves focus before selection. */
async function verifiesManualTabs({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tabs--contract');
  const alpha = page.getByTestId('manual-alpha');
  const beta = page.getByTestId('manual-beta');
  await expect(alpha).toBeVisible({ timeout: 30_000 });
  await alpha.focus();
  await page.keyboard.press('ArrowDown');
  await expect(beta).toBeFocused();
  await expect(alpha).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('manual-panel-alpha')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(beta).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('manual-panel-beta')).toBeVisible();
}

/** Render selected Tabs from the published server entry. */
function renderServerTabs(): JSX.Element {
  return createComponent(TabsRoot, {
    defaultValue: 'one',
    /** Create the list and panels under the primitive's Tabs context. */
    get children() {
      return [
        createComponent(TabsList, {
          /** Keep the trigger under the primitive list. */
          get children() {
            return createComponent(TabsTrigger, { value: 'one', children: 'First tab' });
          },
        }),
        createComponent(TabsContent, { value: 'one', children: 'First panel' }),
      ];
    },
  });
}

/** Verify the distributed server entry emits accessible selected markup. */
function verifiesPublishedTabs(): void {
  const markup = renderToString(renderServerTabs);
  expect(markup).toContain('First tab');
  expect(markup).toContain('First panel');
  expect(markup).toContain('leverui-tabs__root');
  expect(markup).toContain('aria-selected="true"');
}

test(
  'Tabs composes controlled primitive state, IDs, and reactive appearance defaults',
  verifiesControlledTabs,
);
test('Tabs keeps vertical manual focus separate from selection', verifiesManualTabs);
test('published Tabs renders selected accessible content on the server', verifiesPublishedTabs);
