import { expect, test, type Page } from '@playwright/test';
import { dragMouseTo } from './drag-with-movement';

/** Verify dragging changes the active page through Zag's pointer machine. */
async function verifiesMouseDrag({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel-drag--mouse');
  const track = page.getByTestId('carousel-drag-track');
  const progress = page.getByTestId('carousel-drag-progress');
  await expect(progress).toHaveText('1 / 3', { timeout: 30_000 });
  const bounds = await track.boundingBox();
  if (!bounds) throw new Error('Carousel drag track has no browser geometry.');
  const y = bounds.y + bounds.height / 2;
  const from = { x: bounds.x + bounds.width * 0.8, y };
  const to = { x: bounds.x + bounds.width * 0.1, y };
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await dragMouseTo(page, from, to);
  await page.mouse.up();
  await expect(progress).toHaveText('2 / 3');
}

test('Carousel supports mouse dragging when enabled', verifiesMouseDrag);

/** Verify variable slide widths retain page state and spacing. */
async function verifiesVariableSize({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-carousel-drag--variable');
  const root = page.getByTestId('carousel-variable-root');
  const progress = page.getByTestId('carousel-variable-progress');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('style', /--slide-spacing: 16px/);
  await expect(progress).toHaveText('1 / 3');
  await page.getByTestId('carousel-variable-next').click();
  await expect(progress).toHaveText('2 / 3');
}

test('Carousel autoSize tracks variable slide widths', verifiesVariableSize);
