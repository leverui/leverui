import { expect, test, type Page } from '@playwright/test';

/** Verify truthy branches, fallbacks, and live narrowed values. */
async function verifiesShowContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=utilities-show--contract');
  const basic = page.getByTestId('show-basic');
  const countFallback = page.getByTestId('show-count-fallback');
  const value = page.getByTestId('show-value');
  const valueFallback = page.getByTestId('show-value-fallback');

  await expect(basic).toHaveCount(0);
  await expect(countFallback).toBeVisible();
  await expect(valueFallback).toBeVisible();
  await page.getByTestId('show-set-zero').click();
  await expect(value).toHaveCount(0);
  await expect(valueFallback).toBeVisible();

  for (let click = 0; click < 4; click += 1) {
    await page.getByTestId('show-count-toggle').click();
  }
  await expect(basic).toBeVisible();
  await expect(page.getByTestId('show-count-content')).toBeVisible();
  await expect(countFallback).toHaveCount(0);
  await expect(page.locator('[data-testid="show-story"] > [data-testid="show-basic"]')).toHaveCount(
    1,
  );

  await page.getByTestId('show-set-ten').click();
  await expect(value).toHaveText('Value: 10');
  await value.evaluate(
    /** Mark the native node so an update cannot replace it unnoticed. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await page.getByTestId('show-increment-value').click();
  await expect(value).toHaveText('Value: 11');
  await expect(value).toHaveAttribute('data-original-node', 'true');
  await page.getByTestId('show-clear-value').click();
  await expect(value).toHaveCount(0);
  await expect(valueFallback).toBeVisible();
}

test('Show preserves conditional rendering and reactive render functions', verifiesShowContract);
