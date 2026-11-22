import { expect, test, type Page } from '@playwright/test';

/** Verify inherited machine defaults respond without replacing native nodes. */
async function verifiesCarouselDefaults({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel-defaults--reactive');
  const root = page.getByTestId('carousel-defaults-root');
  const progress = page.getByTestId('carousel-defaults-progress');
  const indicators = page.getByTestId('carousel-defaults-indicator');
  const prev = page.getByTestId('carousel-defaults-prev');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('style', /--slide-spacing: 8px/);
  await expect(indicators).toHaveCount(2);
  await expect(prev).toBeDisabled();
  await expect(progress).toHaveText('1 / 2');
  await root.evaluate(
    /** Mark the original machine root before defaults change. */
    (element) => element.setAttribute('data-original', 'true'),
  );
  await page.getByTestId('carousel-defaults-toggle').click();
  await expect(root).toHaveAttribute('data-original', 'true');
  await expect(root).toHaveAttribute('style', /--slide-spacing: 20px/);
  await expect(indicators).toHaveCount(3);
  await expect(progress).toHaveText('1 / 3');
  await expect(prev).toBeEnabled();
  await prev.click();
  await expect(progress).toHaveText('3 / 3');
}

test(
  'Carousel root and PropsProvider update machine settings reactively',
  verifiesCarouselDefaults,
);
