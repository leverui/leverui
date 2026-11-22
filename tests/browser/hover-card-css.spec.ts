import { expect, test, type Page } from '@playwright/test';

/** Check responsive CSS and consumer overrides through a portal. */
async function verifiesHoverCardCss({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto('/iframe.html?id=components-hover-card-css--contract');
  const content = page.getByTestId('hover-css-content');
  const arrow = page.getByTestId('hover-css-arrow');
  const unstyled = page.getByTestId('hover-css-unstyled');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveClass(/leverui-hoverCard__content/);
  await expect(content).toHaveAttribute('data-size', 'xs');
  await expect(content).toHaveAttribute('data-size-md', 'lg');
  await expect(content).toHaveCSS('padding-top', '12px');
  await expect(content).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  await expect(arrow.locator('[data-hover-card-arrow-tip]')).toHaveCSS(
    'background-color',
    'rgb(12, 34, 56)',
  );
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(content).toHaveCSS('padding-top', '24px');
  await expect(unstyled).toBeVisible();
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
}

test('Hover Card CSS follows responsive sizes and consumer overrides', verifiesHoverCardCss);
