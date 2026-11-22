import { expect, test, type Page } from '@playwright/test';

/** Keep grouped bars inside the same plot width as the hosted side legend. */
async function checksSideLegendGeometry({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=charts-bar-chart--legend-position');
  const chart = page.locator('#storybook-root svg[role="img"]');
  await expect(chart).toBeVisible();
  const bars = await chart.locator('[data-bar-series]').evaluateAll(
    /** Read the two bars in the first endpoint category. */
    (elements) =>
      elements.slice(0, 2).map((element) => {
        const { x, width } = element.getBoundingClientRect();
        return [x, width].map(Math.round);
      }),
  );
  expect(bars).toEqual([
    [141, 78],
    [223, 78],
  ]);
  await expect(page.locator('#storybook-root [data-bar-legend]')).toContainText('maxValue');
}

test('top-right Bar Chart legend preserves grouped plot geometry', checksSideLegendGeometry);

/** Match the narrow tick selection and full desktop sequence. */
async function checksResponsiveLegendTicks({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto('/iframe.html?id=charts-bar-chart--legend-position');
  const axes = page.locator('#storybook-root [data-bar-axes]');
  await expect(axes.getByText('Credit card')).toBeVisible();
  await expect(axes.getByText('Add to cart')).toBeVisible();
  await expect(axes.getByText('Web server')).toBeHidden();
  await expect(axes.getByText('Payment')).toBeHidden();
  await expect(axes.getByText('API', { exact: true })).toBeHidden();
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(axes.getByText('Web server')).toBeVisible();
  await expect(axes.getByText('Payment')).toBeVisible();
  await expect(axes.getByText('API', { exact: true })).toBeVisible();
}

test('top-right Bar Chart legend culls narrow category ticks', checksResponsiveLegendTicks);
