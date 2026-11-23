import { expect, test, type Page } from '@playwright/test';

/** Preserve one machine as ARIA orientation, layout, and palette recipe change. */
async function verifiesResponsiveGroup({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-radio-group-family-responsive--responsive');
  const root = page.getByTestId('radio-group-responsive');
  const train = root.getByRole('radio', { name: 'Train' });
  const bus = root.getByRole('radio', { name: 'Bus' });
  const indicator = root.locator('.lui-radio-group__itemControl').first();
  await expect(root).toHaveAttribute('aria-orientation', 'horizontal', { timeout: 45_000 });
  await expect(root).toHaveCSS('flex-direction', 'row');
  await expect(root).toHaveAttribute('data-size-md', 'lg');
  await expect(indicator).toHaveCSS('width', '12px');
  await expect(train).toBeChecked();
  const outlineBackground = await indicator.evaluate(
    /** Read the selected outline mark before changing the recipe. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await root.evaluate(
    /** Mark the original machine root before the viewport changes. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await train.focus();
  await train.press('ArrowRight');
  await expect(bus).toBeChecked();
  await root.getByText('Train', { exact: true }).click();
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(root).toHaveAttribute('aria-orientation', 'vertical');
  await expect(root).toHaveCSS('flex-direction', 'column');
  await expect(indicator).toHaveCSS('width', '24px');
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(train).toBeChecked();
  const solidBackground = await indicator.evaluate(
    /** Read the selected solid mark after the recipe update. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(solidBackground).not.toBe(outlineBackground);
  await train.focus();
  await train.press('ArrowDown');
  await expect(bus).toBeChecked();
  await page.setViewportSize({ width: 600, height: 700 });
  await expect(bus).toBeChecked();
}

test('Radio Group responds without replacing its selection or root', verifiesResponsiveGroup);
