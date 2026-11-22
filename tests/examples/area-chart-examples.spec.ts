import { expect, test, type Page } from '@playwright/test';

const ids = [
  'basic',
  'fill-with-value',
  'percent',
  'axis-label',
  'dashed-area',
  'dots',
  'gradient',
  'nulls',
  'point-label',
  'reference-area',
  'reference-lines',
  'types',
  'value-axis',
] as const;

/** Open one Area Chart story in the preview. */
async function openStory(page: Page, id: (typeof ids)[number]): Promise<void> {
  await page.goto(`/iframe.html?id=charts-area-chart--${id}`);
  await expect(page.locator('#storybook-root svg[role="img"]').first()).toBeVisible();
}

/** Ensure all named examples mount working SVG charts. */
async function rendersAll({ page }: { page: Page }): Promise<void> {
  for (const id of ids) {
    await openStory(page, id);
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Check normalized stacks, gradients, and visual guide data. */
async function checksVariants({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'percent');
  await expect(page.locator('#storybook-root svg text')).toContainText([
    '0%',
    '25%',
    '50%',
    '75%',
    '100%',
  ]);
  await openStory(page, 'fill-with-value');
  await expect(
    page.locator(
      '#storybook-root linearGradient stop[stop-color="var(--leverui-colors-red-solid)"]',
    ),
  ).toHaveCount(2);
  await openStory(page, 'reference-area');
  await expect(page.locator('#storybook-root svg')).toContainText("Feb - June '24");
  await openStory(page, 'reference-lines');
  await expect(page.locator('#storybook-root svg')).toContainText('Summer sale');
  await openStory(page, 'types');
  await expect(page.locator('#storybook-root svg[role="img"]')).toHaveCount(8);
}

/** Compare disconnected and connected sparse sales paths. */
async function checksNulls({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'nulls');
  const charts = page.locator('#storybook-root svg[role="img"]');
  await expect(charts).toHaveCount(2);
  await expect(charts.nth(0).locator('[data-series="sales"] path')).toHaveCount(6);
  await expect(charts.nth(1).locator('[data-series="sales"] path')).toHaveCount(2);
  const baseline = await charts.nth(1).locator('line').first().getAttribute('y1');
  const outline = await charts
    .nth(1)
    .locator('[data-series="sales"] path')
    .last()
    .getAttribute('d');
  expect(baseline).not.toBeNull();
  expect(outline?.match(new RegExp(`L [\\d.]+ ${baseline}(?:\\s|$)`, 'g'))).toHaveLength(2);
}

/** Keep point labels readable at the chart text size. */
async function checksPointLabels({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'point-label');
  const label = page.locator('#storybook-root svg text').filter({ hasText: /^186$/ });
  await expect(label).toHaveCSS('font-size', '12px');
  await expect(label).toHaveCSS('font-weight', '600');
}

/** Navigate the chart tooltip without a pointer. */
async function checksKeyboard({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  await page.locator('#storybook-root [data-chart-interactive]').focus();
  await expect(page.getByRole('tooltip')).toContainText('January');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tooltip')).toContainText('February');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
}

test('all 13 Area Chart examples mount', rendersAll);
test('Area Chart variants show their own scales and guides', checksVariants);
test('Area Chart nulls honor connection policy', checksNulls);
test('Area Chart point labels use the typography', checksPointLabels);
test('Area Chart tooltip supports keyboard navigation', checksKeyboard);
