import { expect, test, type Page } from '@playwright/test';

/** Verify unbroken values truncate while delete controls remain visible. */
async function verifiesLongTags({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-guide--long-tags');
  const control = page.getByTestId('long-tags-control');
  await expect(control.locator('[data-tags-input-item]')).toHaveCount(3, { timeout: 30_000 });
  const first = control.locator('[data-tags-input-item-text]').first();
  const widths = await first.evaluate(
    /** Compare the full string's font width with its rendered tag width. */
    (element) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas context is unavailable.');
      context.font = getComputedStyle(element).font;
      return {
        text: context.measureText(element.textContent ?? '').width,
        tag: element.clientWidth,
      };
    },
  );
  expect(widths.text).toBeGreaterThan(widths.tag);
  await expect(first).toHaveCSS('-webkit-line-clamp', '1');
  await expect(control.locator('[data-tags-input-item-delete-trigger]')).toHaveCount(3);
  const bounds = await control.boundingBox();
  expect(bounds).not.toBeNull();
  if (!bounds) return;
  expect(bounds.width).toBeLessThanOrEqual(312);
}

test('Tags Input truncates long guide values without losing controls', verifiesLongTags);

/** Verify the leading icon leaves room for tags and editable input. */
async function verifiesStartElement({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-guide--start-element');
  const icon = page.getByTestId('tags-start-icon');
  const control = page.getByTestId('tags-start-control');
  const input = page.getByPlaceholder('Add tagged framework');
  await expect(icon).toBeVisible({ timeout: 30_000 });
  await expect(control.locator('[data-tags-input-item]')).toHaveCount(2);
  const iconBounds = await icon.boundingBox();
  const tagBounds = await control.locator('[data-tags-input-item]').first().boundingBox();
  expect(iconBounds).not.toBeNull();
  expect(tagBounds).not.toBeNull();
  if (!iconBounds || !tagBounds) return;
  expect(iconBounds.x + iconBounds.width).toBeLessThan(tagBounds.x);
  await input.fill('Solid');
  await input.press('Enter');
  await expect(control.locator('[data-tags-input-item]')).toHaveCount(3);
}

test('Tags Input composes a start element with editable tags', verifiesStartElement);
