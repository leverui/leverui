import { expect, test, type Page } from '@playwright/test';

const ids = [
  'bar-chart',
  'basic',
  'stock',
  'line-chart',
  'gradient',
  'interaction',
  'reference',
  'stat',
] as const;

/** Open one Sparkline example. */
async function openStory(page: Page, id: (typeof ids)[number]): Promise<void> {
  await page.goto(`/iframe.html?id=charts-sparkline--${id}`);
  await expect(page.locator('#storybook-root svg[role="img"]')).toBeVisible();
}

/** Ensure every named story mounts a chart without a preview failure. */
async function rendersAll({ page }: { page: Page }): Promise<void> {
  for (const id of ids) {
    await openStory(page, id);
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Check bars, gradient stops, and numeric reference markers. */
async function checksSvgVariants({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'bar-chart');
  const bars = page.locator('#storybook-root svg rect');
  await expect(bars).toHaveCount(8);
  await expect(bars.first()).toHaveAttribute('x', '7');
  await expect(bars.last()).toHaveAttribute('x', '96.25');
  await openStory(page, 'gradient');
  await expect(page.locator('#storybook-root svg linearGradient stop')).toHaveCount(2);
  await expect(page.locator('#storybook-root svg path[fill^="url("]')).toHaveCSS(
    'fill-opacity',
    '0.6',
  );
  await openStory(page, 'reference');
  await expect(page.locator('#storybook-root svg line')).toHaveCount(2);
  await expect(page.locator('#storybook-root svg text')).toHaveText(['10', '19']);
  const svg = await page.locator('#storybook-root svg').boundingBox();
  const minimum = await page.locator('#storybook-root svg text').first().boundingBox();
  const maximum = await page.locator('#storybook-root svg text').last().boundingBox();
  if (!svg || !minimum || !maximum) throw new Error('Sparkline reference labels have no bounds');
  expect(minimum.x + minimum.width).toBeCloseTo(svg.x, 0);
  expect(maximum.x).toBeCloseTo(svg.x + svg.width, 0);
}

/** Check the compositions' icons, spacing, and full-width chart. */
async function checksCompositions({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'interaction');
  await expect(page.locator('#storybook-root svg')).toHaveCount(2);
  await expect(page.locator('#storybook-root svg.lucide-download')).toHaveCount(1);
  const interactionChart = page.locator('#storybook-root svg[role="img"]');
  await expect(interactionChart).toHaveAttribute('viewBox', '0 0 192 48');
  const interaction = await interactionChart.boundingBox();
  if (!interaction) throw new Error('Sparkline interaction chart has no bounds');
  expect(interaction.x).toBeCloseTo(248, 0);
  await expect(interactionChart.locator('path[fill="none"]')).toHaveAttribute(
    'd',
    /^M 5 .* L 187 /,
  );
  await openStory(page, 'stat');
  await expect(page.locator('#storybook-root svg')).toHaveCount(2);
  const chart = page.locator('#storybook-root svg[role="img"]');
  await expect(chart).toHaveAttribute('viewBox', '0 0 382 40');
  await expect(chart.locator('path[fill="none"]')).toHaveAttribute('d', /^M 0 .* L 382 /);
  await expect(chart.locator('path:not([fill="none"])')).toHaveAttribute('d', /L 382 40 L 0 40 Z$/);
}

/** Move across the chart and restore its latest weekly value on exit. */
async function checksInteraction({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'interaction');
  await expect(page.locator('#storybook-root')).toContainText('345,000');
  const chart = page.locator('#storybook-root svg[role="img"]');
  const bounds = await chart.boundingBox();
  if (!bounds) throw new Error('Sparkline chart has no visible bounds');
  await page.mouse.move(bounds.x + 3, bounds.y + bounds.height / 2);
  await expect(page.locator('#storybook-root')).toContainText('125,000');
  await page.mouse.move(bounds.x - 20, bounds.y - 20);
  await expect(page.locator('#storybook-root')).toContainText('345,000');
}

test('all eight Sparkline examples mount', rendersAll);
test('Sparkline variants draw their distinct SVG shapes', checksSvgVariants);
test('Sparkline compositions match icon and chart layout', checksCompositions);
test('Sparkline interaction follows and resets the weekly value', checksInteraction);

/** Prove authored defaults and inherited public variables style the SVG. */
async function checksAuthoredCss({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  const chart = page.locator('#storybook-root .lui-sparkline');
  const line = chart.locator('.lui-sparkline__line');
  const area = chart.locator('.lui-sparkline__area');
  await expect(chart).toHaveCSS('display', 'block');
  await expect(chart).toHaveCSS('width', '112px');
  await expect(chart).toHaveCSS('height', '48px');
  await expect(line).toHaveCSS('stroke-width', '2px');
  await expect(area).toHaveCSS('fill-opacity', '0.2');
  await page.addStyleTag({
    content: ':root { --lui-sparkline-color: rgb(12 91 138); --lui-sparkline-line-width: 4; }',
  });
  await expect(line).toHaveCSS('stroke', 'rgb(12, 91, 138)');
  await expect(line).toHaveCSS('stroke-width', '4px');
  await expect(area).toHaveCSS('fill', 'rgb(12, 91, 138)');
}

test('Sparkline uses authored CSS and inherited public variables', checksAuthoredCss);
