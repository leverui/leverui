import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'as-link',
  'attached',
  'basic',
  'compact',
  'controlled',
  'content',
  'count-text',
  'custom-format',
  'sibling-count',
  'sizes',
  'variants',
] as const;

/** Require all eleven pagination stories to render. */
async function verifiesEveryPaginationStory({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-pagination--${id}`);
    await expect(page.locator('#storybook-root nav').first()).toBeVisible();
  }
}

/** Check page selection and boundary navigation in the basic example. */
async function verifiesBasicPagination({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination--basic');
  const previous = page.locator('[data-pagination-previous-trigger]');
  const next = page.locator('[data-pagination-next-trigger]');
  await expect(previous).toBeDisabled();
  await expect(page.locator('[data-pagination-item][aria-current="page"]')).toHaveText('1');
  await next.click();
  await expect(page.locator('[data-pagination-item][aria-current="page"]')).toHaveText('2');
  await expect(previous).toBeEnabled();
}

/** Check controlled content and the three page-count formats. */
async function verifiesContentAndText({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination--content');
  await expect(page.getByText('Support ticket 1', { exact: true })).toBeVisible();
  await page.locator('[data-pagination-next-trigger]').click();
  await expect(page.getByText('Support ticket 6', { exact: true })).toBeVisible();
  await expect(page.getByText('Support ticket 1', { exact: true })).not.toBeVisible();

  await page.goto('/iframe.html?id=components-pagination--compact');
  await expect(page.getByText('1 of 10')).toBeVisible();
  await page.goto('/iframe.html?id=components-pagination--count-text');
  await expect(page.getByText('1 - 5 of 50')).toBeVisible();
  await page.goto('/iframe.html?id=components-pagination--custom-format');
  await expect(page.getByText('Page 1 de 10')).toBeVisible();
}

/** Verify link targets and the four size examples. */
async function verifiesLinksAndSizes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pagination--as-link');
  await expect(page.locator('a[data-pagination-item][aria-current="page"]')).toHaveAttribute(
    'href',
    '?page=1',
  );
  await expect(page.locator('#storybook-root nav a').first()).toHaveAttribute('href', '?page=null');
  await expect(page.locator('#storybook-root nav a').last()).toHaveAttribute('href', '?page=2');

  await page.goto('/iframe.html?id=components-pagination--sizes');
  await expect(page.locator('#storybook-root nav')).toHaveCount(4);
  await expect(page.locator('[data-pagination-next-trigger]')).toHaveCount(4);
}

/** Keep the alternate control sets and sibling range functional. */
async function verifiesVariants({ page }: { page: Page }): Promise<void> {
  for (const id of ['attached', 'controlled', 'variants'] as const) {
    await page.goto(`/iframe.html?id=components-pagination--${id}`);
    await page.locator('[data-pagination-next-trigger]').click();
    await expect(page.locator('[data-pagination-item][aria-current="page"]')).toHaveText('2');
  }
  await page.goto('/iframe.html?id=components-pagination--sibling-count');
  await expect(page.locator('[data-pagination-item][aria-current="page"]')).toHaveText('10');
  await expect(page.locator('[data-pagination-ellipsis]')).toHaveCount(2);
}

test('all Pagination stories render', verifiesEveryPaginationStory);
test('Pagination Basic selects pages', verifiesBasicPagination);
test('Pagination content and count text update', verifiesContentAndText);
test('Pagination links and sizes render', verifiesLinksAndSizes);
test('Pagination variants and sibling range work', verifiesVariants);
