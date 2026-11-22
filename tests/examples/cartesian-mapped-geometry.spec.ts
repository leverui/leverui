import { expect, test, type Page } from '@playwright/test';

/** Keep mapped axis ticks and plot margins at both fixture widths. */
async function verifiesMappedGeometry({ page }: { page: Page }): Promise<void> {
  for (const width of [375, 900]) {
    await page.setViewportSize({ width, height: 700 });
    await page.goto('/iframe.html?id=charts-area-chart--basic');
    await expect(
      page.locator('.leverui-area-chart .leverui-cartesian-chart__axes text'),
    ).toHaveText(['Feb', 'Mar', 'May', 'Jun', 'Aug', 'Oct', 'Nov']);
    await page.goto('/iframe.html?id=charts-line-chart--point-label');
    const chart = page.locator('.leverui-line-chart');
    await expect(chart.locator('.leverui-cartesian-chart__dot').first()).toHaveAttribute(
      'cx',
      '40',
    );
    await expect(chart.locator('.leverui-cartesian-chart__dot').first()).toHaveAttribute(
      'cy',
      '40',
    );
    const firstDot = chart.locator('.leverui-cartesian-chart__dot').first();
    await expect(firstDot).toHaveAttribute('r', '3');
    await expect(firstDot).toHaveAttribute('stroke-width', '2');
    expect(
      await firstDot.evaluate(
        /** Recharts paints its default marker stroke with the same series color. */
        (dot) => getComputedStyle(dot).stroke === getComputedStyle(dot).fill,
      ),
    ).toBe(true);
    const gridLines = chart.locator('.leverui-cartesian-chart__gridLine');
    await expect(gridLines).toHaveCount(7);
    expect(
      await gridLines.evaluateAll(
        /** Horizontal grid lines are absent in the mapped composition. */
        (lines) => lines.every((line) => line.getAttribute('x1') === line.getAttribute('x2')),
      ),
    ).toBe(true);
  }
}

test('mapped Area and Line examples preserve plot geometry', verifiesMappedGeometry);
