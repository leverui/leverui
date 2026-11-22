import { expect, test, type Page } from '@playwright/test';

/** Verify controlled page updates and native asChild ref composition. */
async function verifiesControlledCarousel({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel-state--controlled');
  const root = page.getByTestId('carousel-controlled-root');
  const next = page.getByTestId('carousel-controlled-next');
  const progress = page.getByTestId('carousel-controlled-progress');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(progress).toHaveText('1 / 3');
  await expect(next).toHaveJSProperty('tagName', 'BUTTON');
  await expect(next).toHaveAttribute('data-parent-ref', 'true');
  await expect(next).toHaveAttribute('data-child-ref', 'true');
  await next.click();
  await expect(progress).toHaveText('2 / 3');
  await expect(page.getByTestId('carousel-context-page')).toHaveText('1');
  await root.evaluate(
    /** Tag the original root before an externally controlled page update. */
    (element) => element.setAttribute('data-original', 'true'),
  );
  await page.getByTestId('carousel-jump-last').click();
  await expect(root).toHaveAttribute('data-original', 'true');
  await expect(page.getByTestId('carousel-controlled-value')).toHaveText('2');
  await expect(progress).toHaveText('3 / 3');
  await expect(next).toBeDisabled();
}

test('Carousel follows a controlled page and keeps asChild refs', verifiesControlledCarousel);

/** Verify an external machine drives RootProvider without losing controls. */
async function verifiesCarouselStore({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel-state--store');
  const root = page.getByTestId('carousel-store-root');
  const progress = page.getByTestId('carousel-store-progress');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(progress).toHaveText('2 / 3');
  await expect(page.getByTestId('carousel-store-prev')).toBeEnabled();
  await page.getByTestId('carousel-store-jump').click();
  await expect(progress).toHaveText('3 / 3');
  await expect(page.getByTestId('carousel-store-next')).toBeDisabled();
}

test('Carousel RootProvider responds to its external machine', verifiesCarouselStore);
