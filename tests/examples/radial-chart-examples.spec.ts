import { expect, test, type Page } from '@playwright/test';

/** Open one radial chart story in the public preview. */
async function openStory(page: Page, id: 'basic' | 'legend' | 'label'): Promise<void> {
  await page.goto(`/iframe.html?id=charts-radial-chart--${id}`);
  await expect(page.locator('#storybook-root svg[role="img"]')).toBeVisible();
}

/** Check the three variants and concentric value bars. */
async function checksVariants({ page }: { page: Page }): Promise<void> {
  for (const id of ['basic', 'legend', 'label'] as const) {
    await openStory(page, id);
    await expect(page.locator('#storybook-root [data-radial-bar]')).toHaveCount(4);
    await expect(page.locator('#storybook-root [data-radial-bar] > path')).toHaveCount(8);
  }
  await expect(page.locator('#storybook-root svg text')).toContainText([
    '165',
    '190',
    '195',
    '182',
  ]);
  await expect(page.locator('#storybook-root [role="group"]')).toHaveCount(0);
  await openStory(page, 'legend');
  await expect(page.locator('#storybook-root')).toContainText('January');
  await expect(page.locator('#storybook-root')).toContainText('May');
}

/** Ensure a keyboard user can inspect and dismiss a radial value. */
async function checksKeyboard({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'basic');
  await page.locator('#storybook-root [role="group"]').focus();
  await expect(page.getByRole('tooltip')).toContainText('January');
  await expect(page.getByRole('tooltip')).toContainText('value');
  await expect(page.getByRole('tooltip')).toContainText('165');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tooltip')).toContainText('February');
  await expect(page.getByRole('tooltip')).toContainText('190');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
}

/** Compare curved label placement and preserve the hovered ring through pointer focus. */
async function checksReferenceMetrics({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'label');
  const labels = page.locator('#storybook-root svg text');
  await expect(labels.first()).toHaveCSS('font-size', '12px');
  const labelChart = await page.locator('#storybook-root svg[role="img"]').boundingBox();
  if (!labelChart) throw new Error('The labeled Radial Chart SVG must have bounds.');
  expect(((await labels.first().boundingBox())?.y ?? 0) - labelChart.y).toBeCloseTo(85.9, 0);
  expect(((await labels.last().boundingBox())?.y ?? 0) - labelChart.y).toBeCloseTo(33.6, 0);

  await openStory(page, 'basic');
  const chartBox = await page.locator('#storybook-root svg').boundingBox();
  expect(chartBox).not.toBeNull();
  const x = (chartBox?.x ?? 0) + (chartBox?.width ?? 0) / 2;
  const y = (chartBox?.y ?? 0) + 42;
  await page.mouse.click(x, y);
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toContainText('May');
  await expect(tooltip).toContainText('182');
  const tooltipBox = await tooltip.boundingBox();
  expect(tooltipBox?.x).toBeCloseTo(x + 10, 0);
  // The card sits the same 10px gap below the May ring's anchor, 43.8px into the SVG.
  expect((tooltipBox?.y ?? 0) - (chartBox?.y ?? 0)).toBeCloseTo(53.8, 0);
}

test('Radial Chart examples draw four value rings', checksVariants);
test('Radial Chart tooltip supports keyboard navigation', checksKeyboard);
test('Radial Chart labels and ring tooltip render', checksReferenceMetrics);
