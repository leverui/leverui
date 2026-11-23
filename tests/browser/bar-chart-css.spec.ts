import { expect, test, type Page } from '@playwright/test';

/** Verify fixed paint comes from authored CSS and inherited public variables. */
async function verifiesBarChartCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-bar-chart-css-contract--contract');
  const root = page.locator('[data-testid="bar-chart-contract"] .lui-bar-chart');
  const svg = root.locator('.lui-bar-chart__svg');
  const axes = root.locator('.lui-bar-chart__axes');
  const grid = axes.locator('.lui-bar-chart__grid-line').first();
  const legend = root.locator('.lui-bar-chart__legend');
  await expect(svg).toBeVisible();
  await expect(root).toHaveClass(/consumer-bars-alias/);
  await expect(root).toHaveAttribute('id', 'bar-chart-native');
  await expect(root).toHaveAttribute('title', 'Chart actions');
  await expect(root).toHaveAttribute('data-consumer', 'present');
  await expect(root).toHaveAttribute('data-ref-tag', 'div');
  await expect(root).toHaveAttribute('data-orientation', 'vertical');
  await expect(root).toHaveCSS('width', '360px');
  await expect(svg).toHaveAttribute('height', '270');
  await expect(axes).toHaveCSS('font-size', '17px');
  await expect(grid).toHaveCSS('stroke', 'rgb(255, 0, 0)');
  await expect(legend).toHaveCSS('bottom', '3px');
  await expect(legend).toHaveCSS('gap', '12px');
  await root.focus();
  await expect(root).toHaveAttribute('data-consumer-focus', 'true');
  await root.press('ArrowRight');
  await expect(root).toHaveAttribute('data-consumer-key', 'ArrowRight');
  await svg.evaluate(
    /** Mark the original SVG before chart presentation changes. */
    (element) => element.setAttribute('data-original', 'true'),
  );

  await page.getByTestId('bar-placement-toggle').click();
  await expect(root).toHaveCSS('width', '480px');
  await expect(svg).toHaveAttribute('height', '360');
  await expect(root).toHaveAttribute('data-legend-placement', 'top-right');
  await expect(legend).toHaveCSS('top', '5px');
  await expect(legend).toHaveCSS('flex-direction', 'column');
  await expect(svg).toHaveAttribute('data-original', 'true');

  await page.getByTestId('bar-unstyled-toggle').click();
  await expect(root).toHaveAttribute('data-unstyled', '');
  await expect(axes).not.toHaveCSS('font-size', '17px');
  await expect(svg).toHaveAttribute('data-original', 'true');
}

test('Bar Chart authored CSS preserves native and reactive presentation', verifiesBarChartCss);
