import { expect, test, type Page } from '@playwright/test';

const stories = ['basic', 'action', 'list', 'sizes'];

/** Verify all four Empty State stories display their expected content. */
async function verifiesEmptyStateStories({ page }: { page: Page }): Promise<void> {
  for (const story of stories) {
    await page.goto(`/iframe.html?id=components-empty-state--${story}`);
    await expect(page.locator('#storybook-root .leverui-empty-state__root').first()).toBeVisible();
  }
}

/** Check the action, list, and size variants beyond their story names. */
async function verifiesEmptyStateComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-empty-state--action');
  await expect(page.getByRole('button', { name: 'Create theme' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Import' })).toBeVisible();
  await page.goto('/iframe.html?id=components-empty-state--list');
  await expect(page.locator('#storybook-root li')).toHaveCount(2);
  await page.goto('/iframe.html?id=components-empty-state--sizes');
  await expect(page.locator('#storybook-root .leverui-empty-state__root')).toHaveCount(3);
}

test('all four Empty State examples render', verifiesEmptyStateStories);
test(
  'Empty State actions, list, and size matrix preserve structure',
  verifiesEmptyStateComposition,
);
