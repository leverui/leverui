import { expect, test, type Page } from '@playwright/test';
import { waitForFonts } from './fonts';
import { barChartVariantIds as variantIds } from './bar-chart-variant-ids';

/** Open one public Bar Chart story in its rendered iframe. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=charts-bar-chart--${id}`);
  await expect(page.locator('#storybook-root svg[role="img"]')).toBeVisible();
}

/** Build a check that one public variant renders its bars. */
function checksVariantRenders(id: (typeof variantIds)[number]) {
  /** Open the variant and wait for its first bar. */
  return async ({ page }: { page: Page }): Promise<void> => {
    await openStory(page, id);
    await expect(page.locator('#storybook-root [data-bar-series]').first()).toBeVisible();
  };
}

/** Check the distinctive marks of each implemented variant. */
async function checksVariants({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  await expect(page.locator('#storybook-root [data-bar-series]')).toHaveCount(4);
  await expect(page.locator('#storybook-root [data-bar-axes]')).toContainText('100%');
  await openStory(page, 'bar-color');
  await expect(page.locator('#storybook-root [data-bar-series]').first()).toHaveAttribute(
    'fill',
    'var(--leverui-colors-red-solid)',
  );
  await openStory(page, 'multiple');
  await expect(page.locator('#storybook-root [data-bar-series]')).toHaveCount(16);
  await expect(page.locator('#storybook-root [data-bar-legend]')).toContainText('excellent');
  await openStory(page, 'stacked');
  await expect(page.locator('#storybook-root [data-bar-series]')).toHaveCount(24);
  await openStory(page, 'percent');
  await expect(page.locator('#storybook-root [data-bar-axes]')).toContainText('100%');
  await openStory(page, 'formatter');
  await expect(page.locator('#storybook-root [data-bar-axes]')).toContainText('$100K');
  await openStory(page, 'fill-with-value');
  await expect(page.locator('#storybook-root [data-bar-series]')).toHaveCount(7);
  await expect(page.locator('#storybook-root [data-bar-category="Page B"]')).toHaveAttribute(
    'fill',
    'var(--leverui-colors-red-solid)',
  );
  await expect(page.locator('#storybook-root [data-bar-marks]')).toContainText('-300');
  await openStory(page, 'bar-label');
  await expect(page.locator('#storybook-root [data-bar-marks] text')).toHaveCount(12);
  await openStory(page, 'reference-lines');
  await expect(page.locator('#storybook-root [data-bar-references] rect')).toHaveCount(1);
  await expect(page.locator('#storybook-root [data-bar-references] line')).toHaveCount(1);
  await openStory(page, 'range');
  await expect(page.locator('#storybook-root [data-bar-series]')).toHaveCount(4);
  await openStory(page, 'histogram');
  await expect(page.locator('#storybook-root [data-bar-series]')).toHaveCount(31);
  await expect(page.locator('#storybook-root [data-bar-axes]')).toContainText('Frequency');
  await openStory(page, 'horizontal');
  await expect(page.locator('#storybook-root [data-bar-series]')).toHaveCount(15);
  await expect(page.locator('#storybook-root [data-bar-axes]')).toContainText('Jan');
  await openStory(page, 'candlestick');
  await expect(page.locator('#storybook-root [data-bar-wick]')).toHaveCount(10);
  await expect(page.locator('#storybook-root [data-bar-category="2024-01-01"]')).toHaveAttribute(
    'fill',
    'var(--leverui-colors-red-solid)',
  );
  await openStory(page, 'avatar-ticks');
  await expect(page.locator('#storybook-root [data-bar-axes] img')).toHaveCount(4);
}

/** Ensure the compact composition switches both the selected segment and bars. */
async function checksComposition({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'composition');
  await expect(page.locator('#storybook-root [data-bar-series="windows"]')).toHaveCount(8);
  await page.getByText('Mac (', { exact: false }).click();
  await expect(page.locator('#storybook-root [data-bar-series="mac"]')).toHaveCount(8);
}

/** Keep the floating range marks and numeric ticks aligned. */
async function checksRangeGeometry({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'range');
  const chart = page.locator('#storybook-root svg[role="img"]');
  await expect(chart).toHaveAttribute('height', '384');
  await expect(chart.locator('text').filter({ hasText: /^(0|9|18|27|35)$/ })).toHaveText([
    '0',
    '9',
    '18',
    '27',
    '35',
  ]);
  await expect(chart.locator('text').first()).toHaveCSS('font-size', '12px');
  const first = await chart
    .locator('[data-bar-series]')
    .first()
    .evaluate(
      /** Measure the first floating bar in the 1280px viewport. */
      (element) => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return [x, y, width, height].map(Math.round);
      },
    );
  expect(first).toEqual([218, 217, 100, 94]);
}

/** Preserve the examples' explicit scales and annotation typography. */
async function checksVariantPresentation({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'legend-position');
  await expect(page.locator('#storybook-root [data-bar-axes]')).toContainText('1000');
  await expect(page.locator('#storybook-root [data-bar-axes]')).toContainText('750');
  await openStory(page, 'histogram');
  await expect(page.locator('#storybook-root svg[role="img"]')).toHaveAttribute('height', '384');
  await expect(page.locator('#storybook-root [data-bar-axes]')).toContainText('1000');
  await expect(page.locator('#storybook-root [data-bar-axes] line')).toHaveCount(16);
  await expect(page.locator('#storybook-root [data-bar-axes] path')).toHaveCount(1);
  const histogramBar = await page
    .locator('#storybook-root [data-bar-series]')
    .first()
    .evaluate(
      /** Measure the first nonempty histogram bin at the viewport. */
      (element) => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return [x, y, width, height].map(Math.round);
      },
    );
  expect(histogramBar).toEqual([191, 387, 25, 3]);
  await openStory(page, 'bar-label');
  const valueLabel = page.locator('#storybook-root [data-bar-marks] text').first();
  await expect(valueLabel).toHaveCSS('font-size', '12px');
  await waitForFonts(page);
  const labelY = await valueLabel.evaluate(
    /** Read the first value label's vertical browser position. */
    (element) => Math.round(element.getBoundingClientRect().y),
  );
  expect(labelY).toBe(71);
  await openStory(page, 'fill-with-value');
  const signedLabel = page.locator('#storybook-root [data-bar-marks] text').first();
  await expect(signedLabel).toHaveCSS('font-weight', '500');
  await expect(signedLabel).toHaveCSS('fill', 'rgb(128, 128, 128)');
  await openStory(page, 'avatar-ticks');
  await expect(page.locator('#storybook-root svg[role="img"]')).toHaveAttribute('height', '384');
  await openStory(page, 'reference-lines');
  const label = page.locator('#storybook-root [data-bar-references] text');
  await expect(label).toHaveCSS('font-size', '12px');
  expect(Number(await label.getAttribute('y'))).toBeCloseTo(44.4, 1);
  await openStory(page, 'candlestick');
  const candleAxes = page.locator('#storybook-root [data-bar-axes]');
  await expect(candleAxes.locator('text').filter({ hasText: /^18\d\.\d$/ })).toHaveText([
    '181.0',
    '183.0',
    '185.0',
    '187.0',
  ]);
  await expect(candleAxes.locator('line')).toHaveCount(14);
  const firstWick = page.locator('#storybook-root [data-bar-wick]').first();
  await expect(firstWick.locator('line')).toHaveCount(3);
  expect(Number(await firstWick.locator('line').first().getAttribute('y1'))).toBeCloseTo(52.7, 1);
  await openStory(page, 'no-gap');
  const seamless = page.locator('#storybook-root [data-bar-series]').first();
  await expect(seamless).toHaveAttribute('stroke', 'var(--leverui-colors-bg)');
  expect(
    await seamless.evaluate(
      /** Match the first sales bar height at the gallery viewport. */
      (element) => Math.round(element.getBoundingClientRect().height),
    ),
  ).toBe(257);
}

/** Allow keyboard users to inspect and dismiss a grouped category tooltip. */
async function checksTooltip({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'multiple');
  await page.locator('#storybook-root [role="group"]').focus();
  await expect(page.getByRole('tooltip')).toContainText('mobile');
  await expect(page.getByRole('tooltip')).toContainText('poor: 40');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tooltip')).toContainText('marketing');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.locator('#storybook-root [data-bar-category="social"]').first().hover();
  await expect(page.getByRole('tooltip')).toContainText('social');
}

for (const id of variantIds) test(`Bar Chart ${id} story renders`, checksVariantRenders(id));
test('Bar Chart variants show their distinctive marks', checksVariants);
test('Bar Chart tooltip supports pointer and keyboard categories', checksTooltip);
test('Bar Chart composition switches the visible series', checksComposition);
test('Bar Chart range matches geometry and ticks', checksRangeGeometry);
test('Bar Chart variants keep presentation details', checksVariantPresentation);
