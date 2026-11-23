import { expect, test, type Page } from '@playwright/test';

/** Keep product thumbnails square and the dialog image frame full width. */
async function verifiesCarouselRatios({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/iframe.html?id=components-carousel--dialog');
  await page.getByRole('button', { name: 'View product images' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.evaluate(
    /** Measure only after the opening zoom stops scaling the dialog's boxes. */
    async (element) => {
      await Promise.all(element.getAnimations({ subtree: true }).map((motion) => motion.finished));
    },
  );
  const thumbnail = page.locator('.ratio-carousel-thumb').first();
  await expect(thumbnail).toBeVisible();
  const thumb = await thumbnail.boundingBox();
  if (!thumb) throw new Error('Missing product thumbnail bounds.');
  expect(Math.abs(thumb.width - 64)).toBeLessThan(1.5);
  expect(Math.abs(thumb.height - thumb.width)).toBeLessThan(1.5);

  const image = page.locator('.ratio-carousel-dialog-image').first();
  await expect(image).toBeVisible();
  const frame = await image.boundingBox();
  if (!frame) throw new Error('Missing product image bounds.');
  const contentWidth = await image.locator('xpath=..').evaluate(
    /** Measure the containing block without its padding and border. */
    (element) => {
      const style = getComputedStyle(element);
      return element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    },
  );
  expect(Math.abs(frame.width - contentWidth)).toBeLessThan(1.5);
  expect(frame.height).toBeLessThanOrEqual(720 * 0.72 + 1.5);
}

test('Carousel dialog keeps its AspectRatio image frames', verifiesCarouselRatios);

/** Keep the embedded video cropped to the rounded four-to-three surface. */
async function verifiesDialogVideo({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dialog--close-outside');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  const frame = page.getByRole('dialog').locator('.lui-aspect-ratio');
  await expect(frame).toBeVisible();
  await expect(frame).toHaveCSS('overflow', 'hidden');
  const bounds = await frame.boundingBox();
  if (!bounds) throw new Error('Missing dialog video bounds.');
  expect(Math.abs(bounds.height - bounds.width * 0.75)).toBeLessThan(1.5);
  const radius = await frame.evaluate(
    /** Read the final corner radius from consumer CSS. */
    (element) => parseFloat(getComputedStyle(element).borderTopLeftRadius),
  );
  expect(radius).toBeGreaterThan(0);
}

test('Dialog video keeps its AspectRatio crop and corners', verifiesDialogVideo);
