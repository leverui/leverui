import { expect, test, type Page } from '@playwright/test';

/** Check reactive geometry, native props, and authored CSS suppression. */
async function verifiesSparklineCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-sparkline-css-contract--contract');
  const chart = page.getByTestId('sparkline-reactive').locator('svg');
  const line = chart.locator('.leverui-sparkline__line');
  await expect(chart).toBeVisible({ timeout: 30_000 });
  await expect(chart).toHaveClass(/consumer-chart/);
  await expect(chart).toHaveAttribute('data-ref-tag', 'svg');
  await expect(chart).toHaveCSS('width', '112px');
  await expect(line).toHaveCSS('stroke-width', '3px');
  await chart.evaluate(
    /** Mark the original SVG so a rerender cannot hide a replacement. */
    (element) => {
      element.setAttribute('data-original', 'true');
    },
  );
  await page.getByTestId('sparkline-size-toggle').click();
  await expect(chart).toHaveCSS('width', '160px');
  await expect(chart).toHaveAttribute('viewBox', '0 0 160 48');
  await expect(chart).toHaveAttribute('data-original', 'true');
  const unstyled = page.getByTestId('sparkline-unstyled').locator('svg');
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyled.locator('.leverui-sparkline__line')).not.toHaveCSS('stroke-width', '2px');
}

test('Sparkline authored CSS preserves native and reactive behavior', verifiesSparklineCss);
