import { expect, test, type Page } from '@playwright/test';

/** Check every visible state and the four recipe sizes. */
async function verifiesRadiomarkAppearance({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=feedback-radiomark--contract');
  const unchecked = page.getByTestId('radiomark-unchecked');
  const checked = page.getByTestId('radiomark-checked');
  await expect(unchecked).toBeVisible({ timeout: 15_000 });
  await expect(unchecked).not.toHaveAttribute('data-checked');
  await expect(unchecked.locator('.dot')).toHaveCount(0);
  await expect(checked).toHaveAttribute('data-checked', '');
  await expect(checked.locator('.dot')).toHaveCount(1);
  await expect(page.getByTestId('radiomark-disabled')).toHaveAttribute('data-disabled', '');
  await expect(page.getByTestId('radiomark-checked-disabled')).toHaveCSS('opacity', '0.5');
  await expect(page.getByTestId('radiomark-xs')).toHaveCSS('width', '12px');
  await expect(page.getByTestId('radiomark-sm')).toHaveCSS('width', '16px');
  await expect(page.getByTestId('radiomark-md')).toHaveCSS('width', '20px');
  await expect(page.getByTestId('radiomark-lg')).toHaveCSS('width', '24px');
  await expect(page.getByTestId('radiomark-responsive')).toHaveCSS('width', '12px');
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(page.getByTestId('radiomark-responsive')).toHaveCSS('width', '24px');
  for (const attribute of ['checked', 'disabled', 'size', 'variant', 'filled']) {
    await expect(checked).not.toHaveAttribute(attribute);
  }
}

test('Radiomark renders checked states and sizes', verifiesRadiomarkAppearance);

/** Check variant colors and the documented filled outline appearance. */
async function verifiesRadiomarkVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-radiomark--contract');
  const solid = page.getByTestId('radiomark-solid');
  const subtle = page.getByTestId('radiomark-subtle');
  const outline = page.getByTestId('radiomark-outline');
  const filled = page.getByTestId('radiomark-filled');
  await expect(solid).toBeVisible({ timeout: 15_000 });
  await expect(solid).toHaveCSS('border-radius', '9999px');
  await expect(subtle).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(outline.locator('.dot')).toHaveCSS('scale', '0.6');
  await expect(filled).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.getByTestId('radiomark-teal')).toHaveAttribute('data-checked', '');
  await expect(page.getByTestId('radiomark-red')).toHaveAttribute('data-checked', '');
  await expect(page.getByTestId('radiomark-dark')).toHaveAttribute('data-checked', '');
}

test('Radiomark renders variants, palettes, and filled state', verifiesRadiomarkVariants);

/** Preserve the root while changing visual state and size through signals. */
async function verifiesReactiveRadiomark({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-radiomark--contract');
  const mark = page.getByTestId('radiomark-reactive');
  await expect(mark).toBeVisible({ timeout: 15_000 });
  await mark.evaluate(
    /** Mark the native span before Solid updates its props. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await expect(mark).not.toHaveAttribute('data-checked');
  await expect(mark).toHaveCSS('width', '12px');
  await page.getByTestId('radiomark-toggle').click();
  await expect(mark).toHaveAttribute('data-checked', '');
  await expect(mark).toHaveAttribute('data-disabled', '');
  await expect(mark.locator('.dot')).toHaveCount(1);
  await expect(mark).toHaveCSS('width', '24px');
  await expect(mark).toHaveAttribute('data-original-node', 'true');
}

test('Radiomark updates in place under Solid signals', verifiesReactiveRadiomark);
