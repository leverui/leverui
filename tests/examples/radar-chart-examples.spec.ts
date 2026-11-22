import { expect, test, type Page } from '@playwright/test';

/** Open a public Radar Chart story in the rendered iframe. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=charts-radar-chart--${id}`);
  await expect(page.locator('#storybook-root svg[role="img"]')).toBeVisible();
}

/** Check each example renders its distinct chart features. */
async function checksVariants({ page }: { page: Page }): Promise<void> {
  for (const id of [
    'basic',
    'lines-only',
    'multiple',
    'circle-grid',
    'dots',
    'filled-grid',
    'point-label',
    'tooltip',
  ]) {
    await openStory(page, id);
    await expect(page.locator('#storybook-root [data-radar-series]')).toHaveCount(
      id === 'lines-only' || id === 'multiple' ? 2 : 1,
    );
  }
  await openStory(page, 'circle-grid');
  await expect(page.locator('#storybook-root [data-radar-grid] circle')).toHaveCount(4);
  await openStory(page, 'dots');
  await expect(page.locator('#storybook-root [data-radar-series] circle[fill]')).toHaveCount(5);
  await openStory(page, 'point-label');
  await expect(page.locator('#storybook-root [data-radar-point] text')).toHaveCount(5);
  await openStory(page, 'lines-only');
  await expect(page.locator('#storybook-root [data-radar-series] path[fill="none"]')).toHaveCount(
    2,
  );
}

/** Exercise point and keyboard access to the active category tooltip. */
async function checksTooltip({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'tooltip');
  await page.locator('#storybook-root [role="group"]').focus();
  await expect(page.getByRole('tooltip')).toContainText('January');
  await expect(page.getByRole('tooltip')).toContainText('windows');
  await expect(page.getByRole('tooltip')).toContainText('110');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tooltip')).toContainText('February');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.locator('#storybook-root svg[role="img"]').hover();
  await expect(page.getByRole('tooltip')).toBeVisible();
  const secondPoint = page.locator('#storybook-root [data-radar-point="1"] circle');
  await secondPoint.hover();
  const pointBox = await secondPoint.boundingBox();
  const tooltipBox = await page.getByRole('tooltip').boundingBox();
  expect((tooltipBox?.x ?? 0) + (tooltipBox?.width ?? 0)).toBeLessThan(
    (pointBox?.x ?? 0) + (pointBox?.width ?? 0) / 2,
  );
  await page.locator('#storybook-root [data-radar-point="2"] circle').hover();
  await expect(page.getByRole('tooltip')).toContainText('March');
}

/** Keep the label metrics and comparison stroke visible in the gallery. */
async function checksReferenceMetrics({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'point-label');
  await page.evaluate(
    /** Let the gallery font settle before measuring geometry. */
    async () => document.fonts.ready,
  );
  const category = page.locator('#storybook-root [data-radar-grid] text').first();
  const value = page.locator('#storybook-root [data-radar-point="0"] text');
  await expect(category).toHaveCSS('font-size', '12px');
  await expect(value).toHaveCSS('font-size', '12px');
  const categoryBox = await category.boundingBox();
  const valueBox = await value.boundingBox();
  expect(categoryBox?.y).toBeCloseTo(68.8, 0);
  expect(valueBox?.y).toBeCloseTo(104.9, 0);

  await openStory(page, 'basic');
  const ticks = page.locator('#storybook-root [data-radar-grid] text').filter({ hasText: '35' });
  await expect(ticks).toHaveCSS('font-size', '12px');
  expect((await ticks.boundingBox())?.x).toBeCloseTo(665, 0);

  await openStory(page, 'multiple');
  await expect(page.locator('#storybook-root [data-radar-series] path').first()).toHaveCSS(
    'stroke-width',
    '2px',
  );
}

test('Radar Chart stories render all eight variants', checksVariants);
test('Radar Chart tooltip supports pointer and keyboard inspection', checksTooltip);
test('Radar Chart labels and comparison strokes render', checksReferenceMetrics);
