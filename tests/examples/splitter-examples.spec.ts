import { expect, test, type Page } from '@playwright/test';

const exampleIds = [
  'basic',
  'vertical',
  'multiple-panels',
  'controlled',
  'store',
  'collapsible',
  'keyboard-resize',
  'storage',
  'nested',
  'disabled',
  'conditional-rendering',
  'dynamic-panel',
  'ide-layout',
  'separator-only',
  'responsive-orientation',
  'reset-on-double-click',
  'resize-events',
  'min-max-constraints',
  'css-units',
  'resize-behavior',
  'explorer',
] as const;

/** Require every named example to mount a functioning splitter root. */
async function verifiesEverySplitterExample({ page }: { page: Page }): Promise<void> {
  for (const id of exampleIds) {
    await page.goto(`/iframe.html?id=components-splitter--${id}`);
    await expect(page.locator('[data-splitter-root]').first()).toBeVisible();
    await expect(page.locator('[data-splitter-resize-trigger]').first()).toBeVisible();
  }
}

/** Verify the dynamic example adds and removes actual resizable panels. */
async function verifiesDynamicPanelControls({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-splitter--dynamic-panel');
  const panels = page.locator('[data-splitter-panel]');
  await expect(panels).toHaveCount(2);
  await page.getByRole('button', { name: 'Add panel' }).click();
  await expect(panels).toHaveCount(3);
  await page.getByRole('button', { name: 'Remove panel c' }).click();
  await expect(panels).toHaveCount(2);
}

/** Verify conditional rendering restores a hidden panel through the live machine. */
async function verifiesConditionalPanelControls({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-splitter--conditional-rendering');
  const panels = page.locator('[data-splitter-panel]');
  await expect(panels).toHaveCount(3);
  await page.getByRole('button', { name: 'Hide left' }).click();
  await expect(panels).toHaveCount(2);
  await page.getByRole('button', { name: 'Show left' }).click();
  await expect(panels).toHaveCount(3);
}

/** Verify the IDE file tree changes the editor's displayed source. */
async function verifiesIdeFileSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-splitter--ide-layout');
  await page.getByRole('button', { name: 'index.tsx' }).click();
  await expect(page.getByText("import { render } from '@solidjs/web'")).toBeVisible();
}

/** Match the vertical mobile and horizontal desktop orientations. */
async function verifiesResponsiveOrientation({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 400, height: 720 });
  await page.goto('/iframe.html?id=components-splitter--responsive-orientation');
  const root = page.locator('[data-splitter-root]');
  await expect(root).toHaveAttribute('data-orientation', 'vertical');
  await expect(root).toHaveCSS('width', '288px');

  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(root).toHaveAttribute('data-orientation', 'horizontal');
  await expect(root).toHaveCSS('width', '1168px');
}

test('all Splitter examples render', verifiesEverySplitterExample);
test('dynamic Splitter example manages panels', verifiesDynamicPanelControls);
test('conditional Splitter example toggles panels', verifiesConditionalPanelControls);
test('IDE Splitter example switches files', verifiesIdeFileSelection);
test('responsive Splitter example follows the breakpoint', verifiesResponsiveOrientation);
