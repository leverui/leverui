import { expect, test, type Page } from '@playwright/test';

/** Open a Pie Chart example and wait for its accessible SVG. */
async function openPie(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=charts-pie-chart--${id}`);
  await expect(page.locator('#storybook-root svg[role="img"]')).toBeVisible();
  await expect(page.locator('#storybook-root svg path').first()).toBeVisible();
}

/** Check plot margins, label sizing, and the source legend layout. */
async function checkGeometry({ page }: { page: Page }): Promise<void> {
  await openPie(page, 'basic');
  await expect(page.locator('#storybook-root svg path').first()).toHaveAttribute('d', /A 76 76 /);

  await openPie(page, 'label-inside');
  await expect(page.locator('#storybook-root svg path').first()).toHaveAttribute('d', /A 124 124 /);
  await expect(page.locator('#storybook-root svg text').first()).toHaveCSS('font-size', '12px');
  await expect(page.locator('#storybook-root svg text')).toHaveCount(4);

  await openPie(page, 'label-outside');
  await expect(page.locator('#storybook-root svg text').first()).toHaveCSS('font-size', '12px');
  await expect(page.locator('#storybook-root svg line').first()).toHaveCSS('visibility', 'hidden');

  await openPie(page, 'point-label');
  await expect(page.locator('#storybook-root svg path').first()).toHaveAttribute('d', /A 124 124 /);
  await expect(page.locator('#storybook-root svg line')).toHaveCount(4);
  await expect(page.locator('#storybook-root svg line').first()).toHaveCSS('visibility', 'visible');

  await openPie(page, 'start-angle');
  await expect(page.locator('#storybook-root svg path').first()).toHaveAttribute('d', /A 124 124 /);

  await openPie(page, 'legend');
  await expect(page.locator('#storybook-root svg path').first()).toHaveAttribute(
    'd',
    /A 64\.8 64\.8 /,
  );
  await expect(page.locator('#storybook-root svg > g').first()).toHaveAttribute(
    'transform',
    'translate(0 -14)',
  );
  await expect(
    page.locator('#storybook-root div > span').filter({ hasText: /^(linux|mac|windows)$/ }),
  ).toHaveText(['linux', 'mac', 'windows']);
}

/** Keep the compact tooltip adjacent to both pointer and keyboard selection. */
async function checkTooltip({ page }: { page: Page }): Promise<void> {
  await openPie(page, 'no-stroke');
  const first = page.locator('#storybook-root svg path').first();
  await first.hover();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toContainText('windows');
  await expect(tooltip).toContainText('400');
  const chart = await page.locator('#storybook-root svg').boundingBox();
  const card = await tooltip.boundingBox();
  if (!chart || !card) throw new Error('The Pie Chart tooltip and SVG must have bounds.');
  expect(card.x).toBeGreaterThanOrEqual(chart.x);
  expect(card.x).toBeLessThan(chart.x + chart.width);

  await first.focus();
  await expect(tooltip).toContainText('windows');
  await page.keyboard.press('Escape');
  await expect(tooltip).toHaveCount(0);
}

/** Preserve explicit Donut Chart radii when Pie defaults change. */
async function checkDonut({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=charts-donut-chart--basic');
  const first = page.locator('#storybook-root svg path').first();
  await expect(first).toBeVisible();
  await expect(first).toHaveAttribute('d', /A 100 100 /);
  const chart = await page.locator('#storybook-root svg').boundingBox();
  if (!chart) throw new Error('The Donut Chart SVG must have bounds.');
  await page.mouse.move(chart.x + 185, chart.y + 70);
  await expect(page.getByRole('tooltip')).toContainText('windows');
}

test('Pie Chart sectors, labels, and legend match the geometry', checkGeometry);
test('Pie Chart tooltip follows active sector and supports Escape', checkTooltip);
test('Donut Chart explicit geometry remains intact', checkDonut);
