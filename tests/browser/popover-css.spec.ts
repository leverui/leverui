import { expect, test, type Page } from '@playwright/test';

/** Verify responsive part spacing, consumer CSS, arrow color, and unstyled state. */
async function verifiesPopoverCss({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto('/iframe.html?id=components-popover-css--contract');
  const content = page.getByTestId('popover-css-content');
  const arrow = page.getByTestId('popover-css-arrow');
  const header = page.getByTestId('popover-css-header');
  const body = page.getByTestId('popover-css-body');
  const footer = page.getByTestId('popover-css-footer');
  const unstyled = page.getByTestId('popover-css-unstyled');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveAttribute('data-size', 'xs');
  await expect(content).toHaveAttribute('data-size-md', 'lg');
  await expect(content).toHaveCSS('width', '288px');
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  await expect(arrow.locator('[data-popover-arrow-tip]')).toHaveCSS(
    'background-color',
    'rgb(12, 34, 56)',
  );
  await expect(header).toHaveCSS('padding-top', '12px');
  await expect(body).toHaveCSS('padding-top', '12px');
  await expect(footer).toHaveCSS('padding-bottom', '12px');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(header).toHaveCSS('padding-top', '24px');
  await expect(body).toHaveCSS('padding-top', '24px');
  await expect(footer).toHaveCSS('padding-bottom', '24px');
  await expect(unstyled).toBeVisible();
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
}

test('Popover CSS follows responsive sizes and consumer overrides', verifiesPopoverCss);
