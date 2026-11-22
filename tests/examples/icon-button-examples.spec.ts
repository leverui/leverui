import { expect, test, type Page } from '@playwright/test';

const counts = { basic: 1, rounded: 1, colors: 10, sizes: 4, variants: 5 } as const;
test.setTimeout(180_000);

/** Confirm every icon button example renders its button matrix. */
async function verifiesIconButtonStories({ page }: { page: Page }): Promise<void> {
  for (const [story, count] of Object.entries(counts)) {
    await page.goto(`/iframe.html?id=components-icon-button--${story}`);
    await expect(page.locator('#storybook-root button')).toHaveCount(count, { timeout: 45_000 });
    await expect(page.locator('#storybook-root button[aria-label]')).toHaveCount(count, {
      timeout: 45_000,
    });
  }
}

/** Check the four size labels and five variant labels. */
async function verifiesIconButtonLabels({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-icon-button--sizes');
  await expect(page.locator('#storybook-root p')).toHaveText(['xs', 'sm', 'md', 'lg'], {
    timeout: 45_000,
  });
  await page.goto('/iframe.html?id=components-icon-button--variants');
  await expect(page.locator('#storybook-root p')).toHaveText(
    ['solid', 'subtle', 'surface', 'outline', 'ghost'],
    { timeout: 45_000 },
  );
}

test('all five Icon Button examples render', verifiesIconButtonStories);
test('Icon Button matrices preserve labels', verifiesIconButtonLabels);
