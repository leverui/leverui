import { expect, test, type Page } from '@playwright/test';

/** Verify native SVG state, glyphs, and recipe style in Chromium. */
async function verifiesCheckmarkAppearance({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=feedback-checkmark--contract');
  const unchecked = page.getByTestId('checkmark-unchecked');
  const checked = page.getByTestId('checkmark-checked');
  const indeterminate = page.getByTestId('checkmark-indeterminate');
  await expect(unchecked).toBeVisible({ timeout: 15_000 });
  await expect(unchecked).toHaveAttribute('data-state', 'unchecked');
  await expect(unchecked.locator('path, polyline')).toHaveCount(0);
  await expect(checked).toHaveAttribute('data-state', 'checked');
  await expect(checked.locator('polyline')).toHaveAttribute('points', '20 6 9 17 4 12');
  await expect(indeterminate).toHaveAttribute('data-state', 'indeterminate');
  await expect(indeterminate.locator('path')).toHaveAttribute('d', 'M5 12h14');
  await expect(page.getByTestId('checkmark-disabled')).toHaveAttribute('data-disabled', '');
  await expect(page.getByTestId('checkmark-checked-disabled')).toHaveCSS('opacity', '0.5');
  await expect(page.getByTestId('checkmark-xs')).toHaveCSS('width', '12px');
  await expect(page.getByTestId('checkmark-lg')).toHaveCSS('width', '24px');
  await expect(page.getByTestId('checkmark-responsive')).toHaveCSS('width', '12px');
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(page.getByTestId('checkmark-responsive')).toHaveCSS('width', '24px');
  await expect(page.getByTestId('checkmark-filled')).toHaveCSS('background-color', /rgb\(/);
}

test('Checkmark renders recipe variants and native SVG states', verifiesCheckmarkAppearance);

/** Verify state and disabled styling update on the same mounted SVG. */
async function verifiesCheckmarkReactivity({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-checkmark--contract');
  const root = page.getByTestId('checkmark-reactive');
  await expect(root).toHaveAttribute('data-state', 'unchecked', { timeout: 15_000 });
  await root.evaluate(
    /** Mark the mounted node before any reactive update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('checkmark-cycle').click();
  await expect(root).toHaveAttribute('data-state', 'checked');
  await expect(root.locator('polyline')).toHaveCount(1);
  await page.getByTestId('checkmark-cycle').click();
  await expect(root).toHaveAttribute('data-state', 'indeterminate');
  await expect(root.locator('path')).toHaveCount(1);
  await page.getByTestId('checkmark-toggle-disabled').click();
  await expect(root).toHaveAttribute('data-disabled', '');
  await expect(root).toHaveCSS('opacity', '0.5');
  await expect(root).toHaveAttribute('data-original-node', 'true');
  await page.getByTestId('checkmark-cycle').click();
  await expect(root).toHaveAttribute('data-state', 'unchecked');
  await expect(root.locator('path, polyline')).toHaveCount(0);
}

test(
  'Checkmark updates state and disabled styling without remounting',
  verifiesCheckmarkReactivity,
);
