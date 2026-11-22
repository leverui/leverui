import { expect, test, type Page } from '@playwright/test';

/** Verify autoplay rotates pages, announces manual navigation, and can pause. */
async function verifiesAutoplayToggle({ page }: { page: Page }): Promise<void> {
  await page.clock.install();
  await page.goto('/iframe.html?id=components-carousel-autoplay--toggle');
  const trigger = page.getByTestId('carousel-autoplay-trigger');
  const progress = page.getByTestId('carousel-autoplay-progress');
  const track = page.locator('[data-carousel-item-group]');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('carousel-pause-icon')).toBeVisible();
  await expect(track).toHaveAttribute('aria-live', 'off');
  await page.clock.fastForward(60_000);
  await expect(progress).toHaveText('2 / 3');
  await trigger.click();
  await expect(page.getByTestId('carousel-play-icon')).toBeVisible();
  await expect(page.getByTestId('carousel-pause-icon')).toHaveCount(0);
  await expect(track).toHaveAttribute('aria-live', 'polite');
  await page.clock.fastForward(60_000);
  await expect(progress).toHaveText('2 / 3');
  await trigger.click();
  await expect(page.getByTestId('carousel-pause-icon')).toBeVisible();
  await expect(track).toHaveAttribute('aria-live', 'off');
  await page.clock.fastForward(60_000);
  await expect(progress).toHaveText('3 / 3');
}

test('Carousel autoplay rotates and pauses with accessible announcements', verifiesAutoplayToggle);

/** Keep the pinned autoplay behavior under reduced motion. */
async function verifiesReducedMotionAutoplay({ page }: { page: Page }): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/iframe.html?id=components-carousel-autoplay--toggle');
  const progress = page.getByTestId('carousel-autoplay-progress');
  await expect(progress).toHaveText('1 / 3', { timeout: 30_000 });
  await page.clock.fastForward(60_000);
  await expect(progress).toHaveText('2 / 3');
}

test('Carousel matches autoplay under reduced motion', verifiesReducedMotionAutoplay);
