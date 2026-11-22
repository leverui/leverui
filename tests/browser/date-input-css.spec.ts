import { expect, test, type Page } from '@playwright/test';

/** Verify authored CSS wins while the primitive's date machine stays mounted. */
async function verifiesDateInputCss({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-dateinput-css--contract');
  const root = page.getByTestId('date-input-css-root');
  const group = page.getByTestId('date-input-css-group');
  const hidden = page.getByTestId('date-input-css-hidden');
  await expect(group.getByRole('spinbutton')).toHaveCount(3, { timeout: 30_000 });
  await expect(root).toHaveAttribute('data-size', 'sm');
  await expect(root).toHaveAttribute('data-variant', 'outline');
  await expect(group).toHaveCSS('height', '36px');
  await expect(group).toHaveCSS('border-radius', '12px');
  await expect(group).toHaveCSS('border-top-color', 'rgb(12, 34, 56)');
  await expect(hidden).toHaveValue('3/14/2026');
  await root.evaluate(
    /** Mark the exact machine root before appearance changes. */
    (element) => element.setAttribute('data-root-node', 'true'),
  );

  await page.getByRole('button', { name: 'Toggle date appearance' }).click();
  await expect(root).toHaveAttribute('data-size', 'md');
  await expect(root).toHaveAttribute('data-variant', 'flushed');
  await expect(root).toHaveAttribute('data-root-node', 'true');
  await expect(group).toHaveCSS('height', '40px');
  await expect(group).toHaveCSS('border-top-width', '0px');
  await expect(hidden).toHaveValue('3/14/2026');

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(group).toHaveCSS('height', '44px');
  await expect(group).toHaveCSS('background-color', 'rgb(244, 244, 245)');
  const unstyled = page.getByTestId('date-input-unstyled-group');
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).toHaveCSS('border-top-width', '0px');
}

test(
  'DateInput uses authored responsive CSS and preserves native machine state',
  verifiesDateInputCss,
);
