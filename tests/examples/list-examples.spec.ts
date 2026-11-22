import { expect, test, type Page } from '@playwright/test';

const stories = ['basic', 'nested', 'ordered', 'icon', 'marker-style'] as const;

/** Verify that each list example renders its item count. */
async function verifiesListStories({ page }: { page: Page }): Promise<void> {
  for (const story of stories) {
    await page.goto(`/iframe.html?id=components-list--${story}`);
    await expect(page.locator('#storybook-root > * li')).toHaveCount(story === 'nested' ? 7 : 3);
  }
}

/** Check list semantics and the nested list's placement. */
async function verifiesListStructure({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-list--nested');
  await expect(page.locator('#storybook-root ul ul')).toHaveCount(1);
  await expect(page.locator('#storybook-root ul ul li')).toHaveCount(3);
  await page.goto('/iframe.html?id=components-list--ordered');
  await expect(page.locator('#storybook-root ol li')).toHaveCount(3);
  await page.goto('/iframe.html?id=components-list--icon');
  await expect(page.locator('#storybook-root li svg.leverui-list__indicator')).toHaveCount(3);
  await expect(page.locator('#storybook-root li svg.lucide-circle-check')).toHaveCount(2);
  await expect(
    page.locator('#storybook-root li').last().locator('svg.lucide-circle-dashed'),
  ).toHaveCount(1);
}

test('all five List examples render', verifiesListStories);
test('List examples preserve nested, ordered, and icon semantics', verifiesListStructure);
