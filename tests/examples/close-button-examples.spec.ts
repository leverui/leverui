import { expect, test, type Page } from '@playwright/test';

const examples = [
  ['basic', 1],
  ['sizes', 6],
  ['variants', 4],
  ['custom-icon', 1],
] as const;

/** Require every example to render its expected close actions. */
async function verifiesCloseButtonExamples({ page }: { page: Page }): Promise<void> {
  for (const [id, count] of examples) {
    await page.goto(`/iframe.html?id=components-close-button--${id}`);
    await expect(page.getByRole('button', { name: 'Close' })).toHaveCount(count, {
      timeout: 45_000,
    });
  }
}

/** Keep the custom icon in place of the default close glyph. */
async function verifiesCustomCloseIcon({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-close-button--custom-icon');
  const button = page.getByRole('button', { name: 'Close' });
  await expect(button.locator('svg.lucide-x')).toHaveCount(1);
  await expect(button.locator('svg:not(.lucide-x)')).toHaveCount(0);
}

test('all Close Button examples render', verifiesCloseButtonExamples);
test('custom close icon replaces the default glyph', verifiesCustomCloseIcon);
