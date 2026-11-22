import { expect, test, type Page } from '@playwright/test';

/** Open one Donut Chart story and wait for its first sector. */
async function openDonut(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=charts-donut-chart--${id}`);
  await expect(page.locator('#storybook-root svg path').first()).toBeVisible();
}

/** Match plot offsets, rounded sectors, center text, and grouped labels. */
async function checkDonutVariants({ page }: { page: Page }): Promise<void> {
  await openDonut(page, 'basic');
  await expect(page.locator('#storybook-root svg path').first()).toHaveAttribute('d', /A 100 100 /);

  await openDonut(page, 'point-label');
  await expect(page.locator('#storybook-root svg > g').first()).toHaveAttribute(
    'transform',
    'translate(20 0)',
  );
  await expect(page.locator('#storybook-root svg text')).toHaveCount(4);

  await openDonut(page, 'centered-text');
  const title = page.locator('#storybook-root svg tspan').first();
  await expect(title).toHaveText('1,200');
  await expect(title).toHaveCSS('font-size', '32px');
  await expect(page.locator('#storybook-root svg tspan').last()).toHaveText('users');

  await openDonut(page, 'angle-padding');
  await expect(page.locator('#storybook-root svg path').first()).toHaveAttribute(
    'd',
    /^M 195\.9166.*A 4 4 .*A 100 100 /,
  );
  await expect(page.locator('#storybook-root svg path')).toHaveCount(3);

  await openDonut(page, 'start-and-end-angle');
  await expect(page.locator('#storybook-root svg path').first()).toHaveAttribute('d', /^M 0 /);

  await openDonut(page, 'other-label');
  await expect(page.locator('#storybook-root svg')).toHaveAttribute('width', '384');
  await expect(page.locator('#storybook-root svg text')).toHaveCount(4);
  await expect(page.locator('#storybook-root svg')).toContainText('Other (21.3%)');
}

/** Expand the active segment outward without moving the other sectors. */
async function checkDetachedSegment({ page }: { page: Page }): Promise<void> {
  await openDonut(page, 'detached-segment');
  const first = page.locator('#storybook-root svg path').first();
  await expect(first).toHaveAttribute('d', /A 100 100 /);
  const chart = await page.locator('#storybook-root svg').boundingBox();
  if (!chart) throw new Error('The Donut Chart SVG must have bounds.');
  await page.mouse.move(chart.x + 185, chart.y + 70);
  await expect(first).toHaveAttribute('d', /A 120 120 /);
  await expect(page.getByRole('tooltip')).toContainText('windows');
  await page.mouse.move(chart.x + 100, chart.y + 100);
  await expect(first).toHaveAttribute('d', /A 100 100 /);
  await first.focus();
  await expect(first).toHaveAttribute('d', /A 120 120 /);
  await page.keyboard.press('Escape');
  await expect(first).toHaveAttribute('d', /A 100 100 /);
}

test('Donut Chart examples match the geometry and labels', checkDonutVariants);
test('Donut Chart detached segment expands on hover', checkDetachedSegment);
