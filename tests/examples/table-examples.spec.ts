import { expect, test, type Page } from '@playwright/test';

const stories = [
  'basic',
  'sizes',
  'variants',
  'striped',
  'size-matrix',
  'variant-matrix',
  'caption',
  'caption-top',
  'column-border',
  'column-group',
  'interactive',
  'native',
  'overflow',
  'pagination',
  'selection',
  'selection-action-bar',
  'sticky-column',
  'sticky-header',
  'sticky-header-and-column',
  'tanstack',
] as const;

/** Require every Table example to render product data. */
async function verifiesTableStories({ page }: { page: Page }): Promise<void> {
  test.setTimeout(360_000);
  for (const story of stories) {
    await page.goto(`/iframe.html?id=components-table--${story}`);
    const root = page.locator('#storybook-root');
    await expect(root.locator('table').first(), `${story} should render a table`).toBeVisible({
      timeout: 45_000,
    });
    await expect(root).toContainText(
      story === 'sticky-header-and-column' ? 'Headphones' : 'Monitor',
    );
  }
}

/** Verify caption placement, matrix dimensions, and native markup. */
async function verifiesTableStructure({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-table--caption-top');
  await expect(page.locator('caption')).toHaveCSS('caption-side', 'top');
  await page.goto('/iframe.html?id=components-table--size-matrix');
  await expect(page.locator('#storybook-root tbody table')).toHaveCount(6);
  await page.goto('/iframe.html?id=components-table--variant-matrix');
  await expect(page.locator('#storybook-root tbody table')).toHaveCount(20);
  await page.goto('/iframe.html?id=components-table--tanstack');
  await expect(page.locator('#storybook-root thead th')).toHaveCount(4);
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(5);
}

/** Check row selection, partial state, and the floating selection actions. */
async function verifiesTableSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-table--selection-action-bar');
  const firstRow = page.locator('#storybook-root tbody tr').first();
  await firstRow.locator('[data-checkbox-control]').click();
  await expect(firstRow).toHaveAttribute('data-selected', '');
  await expect(page.getByText('1 selected')).toBeVisible();
  await expect(page.getByRole('button', { name: /Delete/ })).toBeVisible();
  await page.locator('#storybook-root thead [data-checkbox-control]').click();
  await expect(page.getByText('5 selected')).toBeVisible();
}

/** Verify both sticky axes keep the 36 rows and CSS positioning. */
async function verifiesStickyTable({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-table--sticky-header-and-column');
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(36);
  await expect(page.locator('#storybook-root thead tr')).toHaveCSS('position', 'sticky');
  await expect(page.locator('#storybook-root tbody [data-sticky]').first()).toHaveCSS(
    'position',
    'sticky',
  );
}

test('all Table examples render', verifiesTableStories);
test('Table captions, matrices, and TanStack structure match', verifiesTableStructure);
test('Table selection drives the action bar', verifiesTableSelection);
test('Table combined sticky layout retains 36 rows', verifiesStickyTable);
