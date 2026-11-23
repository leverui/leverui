import { expect, test, type Page } from '@playwright/test';

const counts = { basic: 4, label: 4, sizes: 9, 'size-matrix': 30 } as const;

/** Verify the status groups and complete size matrix. */
async function verifiesStatusStories({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  for (const [story, count] of Object.entries(counts)) {
    await page.goto(`/iframe.html?id=components-status--${story}`);
    await expect(page.locator('#storybook-root .lui-status__root')).toHaveCount(count, {
      timeout: 45_000,
    });
  }
}

/** Confirm size labels and palette rows match the matrix. */
async function verifiesStatusMatrix({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-status--size-matrix');
  await expect(page.locator('#storybook-root thead th')).toHaveText(['', 'sm', 'md', 'lg']);
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(10);
}

test('all Status examples and the matrix render', verifiesStatusStories);
test('Status sizes include all palettes', verifiesStatusMatrix);
