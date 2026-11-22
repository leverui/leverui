import { expect, test, type Page } from '@playwright/test';

const ids = [
  'axes-label',
  'basic',
  'multiple',
  'no-dots',
  'start-end-tick',
  'value-formatter',
  'dashed',
  'nulls',
  'stroke-width',
  'value-domain',
  'composition',
  'series-label',
  'types',
  'custom-dot',
  'gradient',
  'point-label',
  'custom-tooltip',
  'legend-interaction',
  'reference-point',
  'biaxial',
] as const;

/** Open one Line Chart example and wait for its SVG. */
async function openStory(page: Page, id: (typeof ids)[number]): Promise<void> {
  await page.goto(`/iframe.html?id=charts-line-chart--${id}`);
  await expect(page.locator('#storybook-root svg[role="img"]').first()).toBeVisible();
}

/** Check all completed examples mount without Storybook errors. */
async function rendersAll({ page }: { page: Page }): Promise<void> {
  for (const id of ids) {
    await openStory(page, id);
    await expect(page.locator('#storybook-root [data-storybook-error]')).toHaveCount(0);
  }
}

/** Verify distinct reference-line treatments and value scales. */
async function checksVariants({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'dashed');
  await expect(page.locator('#storybook-root svg text').filter({ hasText: /^\d+$/ })).toHaveText([
    '140',
    '155',
    '170',
    '185',
    '195',
  ]);
  await expect(page.locator('[data-series="windows"] path')).toHaveAttribute(
    'stroke-dasharray',
    '5 5',
  );
  await openStory(page, 'no-dots');
  await expect(page.locator('#storybook-root svg circle')).toHaveCount(0);
  await openStory(page, 'stroke-width');
  await expect(page.locator('[data-series="sales"] path')).toHaveAttribute('stroke-width', '4');
  await openStory(page, 'value-domain');
  await expect(page.locator('#storybook-root svg text').filter({ hasText: /^\d+$/ })).toHaveText([
    '160',
    '175',
    '190',
    '205',
  ]);
  await openStory(page, 'value-formatter');
  await expect(page.locator('#storybook-root svg')).toContainText('$100K');
  await openStory(page, 'start-end-tick');
  await expect(page.locator('#storybook-root svg')).toContainText('Sales, January to August');
  await expect(page.locator('#storybook-root svg text')).not.toContainText(['Feb', 'Mar']);
  await expect(page.locator('#storybook-root [data-chart-interactive]')).toHaveCount(0);
}

/** Check that missing months do not split a connected line. */
async function checksNulls({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'nulls');
  await expect(page.locator('[data-series="sales"] path')).toHaveCount(1);
  await expect(page.locator('[data-series="sales"] circle')).toHaveCount(5);
}

/** Verify the composed card, series labels, and interpolation gallery. */
async function checksComposed({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'composition');
  await expect(page.getByText('Customers by channel')).toBeVisible();
  await expect(page.locator('#storybook-root')).toContainText('325');
  await expect(page.locator('#storybook-root')).toContainText('387');
  await expect(page.locator('#storybook-root')).toContainText('327');
  await openStory(page, 'series-label');
  await expect(page.locator('#storybook-root')).toContainText('Mac sales');
  await expect(page.locator('#storybook-root')).toContainText('Linux sales');
  await openStory(page, 'types');
  await expect(page.locator('#storybook-root svg[role="img"]')).toHaveCount(8);
}

/** Check per-point styling, multicolor stroke, and right-aligned labels. */
async function checksMarkers({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'custom-dot');
  await expect(page.locator('[data-series="sales"] circle')).toHaveCount(5);
  await expect(page.locator('[data-series="sales"] circle').first()).toHaveAttribute('r', '5');
  await openStory(page, 'gradient');
  await expect(page.locator('#storybook-root linearGradient stop')).toHaveCount(5);
  await expect(page.locator('[data-series="temp"] path')).toHaveAttribute('stroke', /url\(#/);
  await openStory(page, 'point-label');
  await expect(page.locator('[data-series="uv"] text')).toHaveCount(7);
  await expect(page.locator('[data-series="uv"] text').first()).toContainText('400');
}

/** Check custom tooltip content and hover-driven series emphasis. */
async function checksInteractions({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'custom-tooltip');
  await page.locator('#storybook-root [data-chart-interactive]').focus();
  await expect(page.getByRole('tooltip')).toContainText('January Customers');
  await expect(page.getByRole('tooltip')).toContainText('10');
  await openStory(page, 'legend-interaction');
  await page.getByText('mac', { exact: true }).hover();
  await expect(page.locator('[data-series="linux"]')).toHaveAttribute('data-muted', '');
  await expect(page.locator('[data-series="linux"]')).toHaveCSS('opacity', '0.2');
  await expect(page.locator('[data-series="mac"]')).toHaveCSS('opacity', '1');
  await page.getByRole('button', { name: 'linux' }).focus();
  await expect(page.locator('[data-series="mac"]')).toHaveAttribute('data-muted', '');
  await expect(page.locator('[data-series="mac"]')).toHaveCSS('opacity', '0.2');
}

/** Verify an independent right scale and the target guides. */
async function checksGuides({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'reference-point');
  await expect(page.locator('#storybook-root svg text').filter({ hasText: /^\d+$/ })).toHaveText([
    '0',
    '30',
    '60',
    '90',
    '120',
  ]);
  await expect(page.locator('#storybook-root svg')).toContainText('Target');
  await expect(page.locator('#storybook-root svg circle')).toHaveCount(1);
  await openStory(page, 'biaxial');
  await expect(page.locator('#storybook-root [data-chart-right-axis]')).toContainText('Mac');
  await expect(page.locator('#storybook-root svg')).toContainText('Windows');
  await expect(page.locator('#storybook-root [data-series="mac"] path')).toHaveCount(1);
}

test('all 20 Line Chart examples mount', rendersAll);
test('Line Chart variants preserve their data and styles', checksVariants);
test('Line Chart nulls connect the remaining points', checksNulls);
test('Line Chart composition and curve gallery match content', checksComposed);
test('Line Chart gradient and point markers use their styles', checksMarkers);
test('Line Chart tooltip and legend respond to user input', checksInteractions);
test('Line Chart dual axes and reference guides have independent content', checksGuides);
