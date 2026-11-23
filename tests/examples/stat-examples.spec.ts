import { expect, test, type Page } from '@playwright/test';

const counts = {
  basic: 1,
  'format-options': 1,
  'stat-group': 2,
  icon: 1,
  indicator: 1,
  'info-tip': 1,
  'progress-bar': 1,
  trend: 1,
  'value-unit': 1,
} as const;

/** Verify that all nine Stat examples render semantic description lists. */
async function verifiesStatStories({ page }: { page: Page }): Promise<void> {
  for (const [story, count] of Object.entries(counts)) {
    await page.goto(`/iframe.html?id=components-stat--${story}`);
    await expect(page.locator('#storybook-root dl.lui-stat__root')).toHaveCount(count);
  }
}

/** Check formatted values, trend indicators, and the information popover. */
async function verifiesStatComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-stat--format-options');
  await expect(page.locator('#storybook-root dd')).toHaveText('$935.40');
  await page.goto('/iframe.html?id=components-stat--stat-group');
  await expect(page.locator('#storybook-root [data-type="up"]')).toHaveCount(1);
  await expect(page.locator('#storybook-root [data-type="down"]')).toHaveCount(1);
  await page.goto('/iframe.html?id=components-stat--info-tip');
  await page.getByRole('button', { name: 'info' }).click();
  await expect(page.getByRole('dialog', { name: 'Each visitor is counted once' })).toBeVisible();
  await page.goto('/iframe.html?id=components-stat--progress-bar');
  await expect(page.locator('#storybook-root .lui-progress__track')).toHaveCount(1);
}

test('all nine Stat examples render', verifiesStatStories);
test('Stat formatting, indicators, and information preserve behavior', verifiesStatComposition);
