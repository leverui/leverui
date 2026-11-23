import { expect, test, type Page } from '@playwright/test';

/** Verify chart hooks, inherited tokens, native props, and reactive dimensions. */
async function verifiesChartCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-radar-and-scatter-css-contract--contract');
  const radar = page.locator('.lui-radar-chart');
  const scatter = page.locator('.lui-scatter-chart');
  await expect(radar).toBeVisible({ timeout: 30_000 });
  await expect(scatter).toBeVisible();
  await expect(radar).toHaveClass(/consumer-radar/);
  await expect(radar).toHaveClass(/consumer-radar-alias/);
  const aliasCount = await radar.evaluate(
    /** Count raw class tokens so duplicate aliases cannot pass classList checks. */
    (element) =>
      element
        .getAttribute('class')
        ?.split(/\s+/)
        .filter((token) => token === 'consumer-radar-alias').length ?? 0,
  );
  expect(aliasCount).toBe(1);
  await expect(scatter).toHaveClass(/consumer-scatter/);
  await expect(radar).toHaveAttribute('title', 'Radar native title');
  await expect(scatter).toHaveAttribute('title', 'Scatter native title');
  await expect(radar).toHaveAttribute('data-ref-tag', 'div');
  await expect(scatter).toHaveAttribute('data-ref-tag', 'div');
  await expect(radar).toHaveCSS('margin-left', '13px');
  await expect(scatter).toHaveCSS('margin-left', '17px');
  await expect(radar).toHaveCSS('width', '384px');
  await expect(scatter).toHaveCSS('height', '384px');
  await expect(radar.locator('.lui-radar-chart__angle-label').first()).toHaveCSS(
    'font-size',
    '12px',
  );
  await expect(radar.locator('.lui-radar-chart__legend')).toHaveCSS('display', 'flex');
  await expect(scatter.locator('.lui-scatter-chart__tick-label').first()).toHaveCSS(
    'font-size',
    '12px',
  );
  await expect(scatter.locator('.lui-scatter-chart__trend')).toHaveCSS('stroke-width', '2px');
  await radar.focus();
  await expect(radar).toHaveAttribute('data-native-focus', 'true');
  await radar.press('ArrowRight');
  await expect(radar).toHaveAttribute('data-native-key', 'ArrowRight');
  await scatter.focus();
  await expect(scatter).toHaveAttribute('data-native-focus', 'true');
  await scatter.press('ArrowRight');
  await expect(scatter).toHaveAttribute('data-native-key', 'ArrowRight');
  await page.addStyleTag({
    content:
      ':root { --lui-radar-chart-grid-fill: rgb(255, 0, 0); --lui-scatter-chart-trend-stroke: rgb(0, 128, 0); }',
  });
  await expect(radar.locator('.lui-radar-chart__ring').first()).toHaveCSS('fill', 'rgb(255, 0, 0)');
  await expect(scatter.locator('.lui-scatter-chart__trend')).toHaveCSS('stroke', 'rgb(0, 128, 0)');
  const widthOverride = await page.addStyleTag({
    content: ':root { --lui-radar-chart-width: 300px; }',
  });
  await expect(radar).toHaveCSS('width', '300px');
  await radar.focus();
  await expect(radar.getByRole('tooltip')).toHaveCSS('left', '160px');
  await widthOverride.evaluate(
    /** Restore the numeric width prop before its reactive resize assertion. */
    (element) => {
      const parent = element.parentNode;
      if (!parent) throw new Error('Radar width override has no parent.');
      parent.removeChild(element);
    },
  );
  await radar.evaluate(
    /** Mark the original root so a rerender cannot hide a replacement. */
    (element) => element.setAttribute('data-original', 'true'),
  );
  await scatter.evaluate(
    /** Mark the original measured root so a rerender cannot hide a replacement. */
    (element) => element.setAttribute('data-original', 'true'),
  );
  await page.getByTestId('chart-size-toggle').click();
  await expect(radar).toHaveCSS('width', '320px');
  await expect(scatter).toHaveCSS('height', '300px');
  await expect(radar).toHaveAttribute('data-original', 'true');
  await expect(scatter).toHaveAttribute('data-original', 'true');
  await page.getByTestId('chart-tooltip-toggle').click();
  await radar.focus();
  await radar.press('ArrowRight');
  await expect(radar).toHaveAttribute('data-default-prevented', 'false');
  await scatter.focus();
  await scatter.press('ArrowRight');
  await expect(scatter).toHaveAttribute('data-default-prevented', 'false');
}

test('Radar and Scatter authored CSS preserves native and reactive behavior', verifiesChartCss);
