import { expect, test, type Page } from '@playwright/test';
import { expectCustomPropertyLength } from './css-length';

/** Check separator count, dimensions, and line styles across six stories. */
async function verifiesSeparatorGallery({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const [story, count] of [
    ['basic', 2],
    ['vertical', 1],
    ['label', 4],
    ['responsive-orientation', 1],
    ['sizes', 4],
    ['variants', 3],
  ] as const) {
    await page.goto(`/iframe.html?id=components-separator--${story}`);
    await expect(page.locator('#storybook-root .lui-separator')).toHaveCount(count);
  }

  await page.goto('/iframe.html?id=components-separator--vertical');
  const vertical = page.locator('#storybook-root .lui-separator');
  await expect(vertical).toHaveAttribute('aria-orientation', 'vertical');
  const verticalBounds = await vertical.boundingBox();
  expect([verticalBounds?.width, verticalBounds?.height]).toEqual([1, 16]);

  await page.goto('/iframe.html?id=components-separator--sizes');
  const sizes = page.locator('#storybook-root .lui-separator');
  await expectCustomPropertyLength(sizes.first(), '--lui-private-separator-thickness', '0.5px');
  for (const [index, thickness] of ['1px', '2px', '3px'].entries()) {
    await expect(sizes.nth(index + 1)).toHaveCSS('border-top-width', thickness);
  }

  await page.goto('/iframe.html?id=components-separator--variants');
  const variants = page.locator('#storybook-root .lui-separator');
  for (const [index, style] of ['solid', 'dashed', 'dotted'].entries()) {
    await expect(variants.nth(index)).toHaveCSS('border-top-style', style);
  }
}

/** Check the orientation switch at narrow and desktop widths. */
async function verifiesResponsiveOrientation({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 400, height: 720 });
  await page.goto('/iframe.html?id=components-separator--responsive-orientation');
  const separator = page.locator('#storybook-root .lui-separator');
  await expect(separator).toHaveAttribute('role', 'presentation');
  const narrow = await separator.boundingBox();
  expect([narrow?.width, narrow?.height]).toEqual([1, 26]);

  await page.setViewportSize({ width: 1280, height: 720 });
  const wide = await separator.boundingBox();
  expect([wide?.width, wide?.height]).toEqual([1168, 1]);
}

test('Separator gallery matches sizes and variants', verifiesSeparatorGallery);
test('Separator responsive orientation matches example', verifiesResponsiveOrientation);
