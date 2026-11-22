import { expect, test, type Page } from '@playwright/test';

/** Verify vertical machine attributes and orientation-aware recipe layout. */
async function verifiesVerticalCarousel({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel-orientation--vertical');
  const root = page.getByTestId('carousel-vertical-root');
  const control = page.getByTestId('carousel-vertical-control');
  const progress = page.getByTestId('carousel-vertical-progress');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-orientation', 'vertical');
  await expect(root).toHaveCSS('flex-direction', 'row');
  await expect(control).toHaveCSS('flex-direction', 'column');
  await expect(page.getByTestId('carousel-vertical-prev')).toBeDisabled();
  await page.getByTestId('carousel-vertical-next').click();
  await expect(progress).toHaveText('2 / 3');
}

test('Carousel vertical orientation changes machine and recipe layout', verifiesVerticalCarousel);

/** Verify generated indicators follow page snap points instead of slide count. */
async function verifiesPagedCarousel({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel-orientation--paged');
  const indicators = page.getByTestId('carousel-paged-indicator');
  const progress = page.getByTestId('carousel-paged-progress');
  await expect(progress).toHaveText('1 / 2', { timeout: 30_000 });
  await expect(indicators).toHaveCount(2);
  await page.getByTestId('carousel-paged-next').click();
  await expect(progress).toHaveText('2 / 2');
}

test('Carousel shortcut creates one indicator per page snap point', verifiesPagedCarousel);

/** Keep active page and controls while a consumer media query changes width. */
async function verifiesResponsiveCarousel({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-carousel-orientation--responsive');
  const root = page.getByTestId('carousel-responsive-root');
  const item = page.getByTestId('carousel-responsive-item-0');
  const next = page.getByTestId('carousel-responsive-next');
  const progress = page.getByTestId('carousel-responsive-progress');
  await expect(root).toHaveCSS('width', '360px', { timeout: 30_000 });
  await expect(item).toHaveCSS('width', '360px');
  await next.click();
  await expect(progress).toHaveText('2 / 3');
  await page.setViewportSize({ width: 375, height: 700 });
  await expect(root).toHaveCSS('width', '200px');
  await expect(item).toHaveCSS('width', '200px');
  await expect(progress).toHaveText('2 / 3');
  await next.click();
  await expect(progress).toHaveText('3 / 3');
}

test('Carousel retains navigation through a responsive resize', verifiesResponsiveCarousel);
