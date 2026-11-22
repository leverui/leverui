import { expect, test, type Page } from '@playwright/test';

/** Verify machine semantics, disabled boundaries, and indexed navigation. */
async function verifiesCarouselControls({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel--contract');
  const root = page.getByTestId('carousel-root');
  const prev = page.getByTestId('carousel-prev');
  const next = page.getByTestId('carousel-next');
  const progress = page.getByTestId('carousel-progress');
  const indicators = page.getByTestId('carousel-indicator');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('role', 'region');
  await expect(root).toHaveAttribute('aria-roledescription', 'carousel');
  await expect(page.getByTestId('carousel-item-0')).toHaveAttribute('role', 'group');
  await expect(prev).toBeDisabled();
  await expect(next).toBeEnabled();
  await expect(prev.locator('svg path')).toHaveAttribute('d', 'm15 18-6-6 6-6');
  await expect(next.locator('svg path')).toHaveAttribute('d', 'm9 18 6-6-6-6');
  await expect(indicators).toHaveCount(4);
  await expect(progress).toHaveText('1 / 4');
  await next.click();
  await expect(progress).toHaveText('2 / 4');
  await indicators.nth(3).click();
  await expect(progress).toHaveText('4 / 4');
  await expect(next).toBeDisabled();
  await prev.click();
  await expect(progress).toHaveText('3 / 4');
  await indicators.nth(2).focus();
  await page.keyboard.press('ArrowRight');
  await expect(progress).toHaveText('4 / 4');
  await page.keyboard.press('Home');
  await expect(progress).toHaveText('1 / 4');
}

test('Carousel controls and indicators follow the primitive page state', verifiesCarouselControls);
