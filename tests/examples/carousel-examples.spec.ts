import { expect, test, type Page } from '@playwright/test';
import { dragMouseTo } from '../browser/drag-with-movement';

const storyIds = [
  'basic',
  'controlled',
  'store',
  'vertical',
  'floating-arrow',
  'indicators',
  'mouse-drag',
  'progress-text',
  'slides-per-page',
  'slides-per-move',
  'spacing',
  'variable-size',
  'dialog',
  'thumbnails',
  'autoplay',
  'images',
  'composition',
  'explorer',
] as const;

/** Require all eighteen examples to render their starting controls. */
async function verifiesEveryCarouselExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(480_000);
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-carousel--${id}`);
    const control =
      id === 'dialog'
        ? page.getByRole('button', { name: 'View product images' })
        : page.locator('[data-carousel-root]').first();
    await expect(control, `Carousel example ${id} should render`).toBeVisible({ timeout: 45_000 });
  }
}

/** Verify the basic arrows advance and select indexed slides. */
async function verifiesBasicNavigation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel--basic');
  const previous = page.locator('[data-carousel-previous-trigger]');
  const next = page.locator('[data-carousel-next-trigger]');
  await expect(previous).toBeDisabled();
  await next.click();
  await expect(previous).toBeEnabled();
  await expect(page.locator('[data-carousel-indicator][data-current]')).toHaveCount(1);
}

/** Verify the caller-owned store jumps directly to slide three. */
async function verifiesStoreJump({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel--store');
  await page.getByText('Go to slide 3', { exact: true }).click();
  await expect(page.locator('[data-carousel-indicator][data-current]')).toHaveAttribute(
    'data-index',
    '2',
  );
}

/** Verify the dialog opens with a full-screen product carousel. */
async function verifiesProductDialog({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/iframe.html?id=components-carousel--dialog');
  await page.getByRole('button', { name: 'View product images' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(dialog).toHaveCSS('box-shadow', 'none');
  const body = dialog.locator('.carousel-example-dialog-body');
  await expect(body).toHaveCSS('display', 'flex');
  await expect(body).toHaveCSS('padding', '0px');
  await expect(body).toHaveCSS('height', '720px');
  await expect(page.locator('[data-carousel-root]')).toBeVisible();
  await expect(page.getByAltText('Product 1').first()).toBeVisible();
}

/** Verify image thumbnails switch the current Carousel page. */
async function verifiesImageThumbnails({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel--thumbnails');
  await page.locator('[data-carousel-indicator]').nth(1).click();
  await expect(page.locator('[data-carousel-indicator]').nth(1)).toHaveAttribute(
    'data-current',
    '',
  );
}

/** Verify page sizing and move distance produce the snap counts. */
async function verifiesPageSizing({ page }: { page: Page }): Promise<void> {
  test.setTimeout(240_000);
  await page.goto('/iframe.html?id=components-carousel--slides-per-page');
  await expect(page.locator('[data-carousel-root]')).toBeVisible({
    timeout: 45_000,
  });
  await expect(page.locator('[data-carousel-indicator]')).toHaveCount(3);
  await page.goto('/iframe.html?id=components-carousel--slides-per-move');
  await expect(page.locator('[data-carousel-indicator]')).toHaveCount(4);
  await page.goto('/iframe.html?id=components-carousel--vertical');
  await expect(page.locator('[data-carousel-root]')).toHaveAttribute(
    'data-orientation',
    'vertical',
  );
}

/** Verify dragging the gallery example advances its current page. */
async function verifiesMouseDrag({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel--mouse-drag');
  const track = page.locator('[data-carousel-item-group]');
  await expect(track).toBeVisible();
  const bounds = await track.boundingBox();
  if (!bounds) throw new Error('Carousel drag track has no browser geometry.');
  const y = bounds.y + bounds.height / 2;
  const from = { x: bounds.x + bounds.width * 0.8, y };
  const to = { x: bounds.x + bounds.width * 0.1, y };
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await dragMouseTo(page, from, to);
  await page.mouse.up();
  await expect(page.locator('[data-carousel-indicator][data-current]')).toHaveAttribute(
    'data-index',
    '1',
  );
}

/** Verify autoplay advances and its trigger pauses later movement. */
async function verifiesAutoplay({ page }: { page: Page }): Promise<void> {
  await page.clock.install();
  await page.goto('/iframe.html?id=components-carousel--autoplay');
  const current = page.locator('[data-carousel-item][data-inview]');
  const toggle = page.getByRole('button', { name: 'Toggle autoplay' });
  await expect(toggle).toBeVisible();
  await page.clock.fastForward(2_000);
  await expect(current.first()).toHaveAttribute('data-index', '1');
  await toggle.click();
  await page.clock.fastForward(4_000);
  await expect(current.first()).toHaveAttribute('data-index', '1');
}

test('all Carousel examples render', verifiesEveryCarouselExample);
test('basic Carousel arrows navigate indexed slides', verifiesBasicNavigation);
test('Carousel store jumps to the requested slide', verifiesStoreJump);
test('product dialog contains a working Carousel', verifiesProductDialog);
test('thumbnail indicators navigate the image Carousel', verifiesImageThumbnails);
test('Carousel page sizing and orientation are correct', verifiesPageSizing);
test('Carousel mouse-drag example advances a page', verifiesMouseDrag);
test('Carousel autoplay example pauses on command', verifiesAutoplay);
