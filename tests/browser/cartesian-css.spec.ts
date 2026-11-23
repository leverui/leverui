import { expect, test, type Page } from '@playwright/test';

/** Verify Area Chart CSS hooks, native root props, and reactive geometry. */
async function verifiesAreaCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-cartesian-css--area');
  const root = page.locator('#cartesian-area-root');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveClass(/lui-area-chart/);
  await expect(root).toHaveAttribute('data-ref', 'bound');
  await expect(root).toHaveCSS('width', '420px');
  await expect(root.locator('.lui-cartesian-chart__svg')).toHaveCSS('height', '260px');
  await expect(root.locator('.lui-cartesian-chart__axes')).toHaveCSS('font-size', '12px');
  await expect(root.locator('.lui-cartesian-chart__axes')).toHaveAttribute('data-grid-dashed', '');
  await expect(root.locator('.lui-cartesian-chart__referenceLabel')).toHaveCSS('font-size', '12px');
  await expect(root.locator('.lui-cartesian-chart__legend')).toHaveCSS('gap', '20px');
  await expect(root.locator('.lui-cartesian-chart__legend')).toHaveCSS('position', 'absolute');
  await expect(root.locator('.lui-cartesian-chart__area').first()).toHaveCSS('stroke', 'none');
  const areaPath = root.locator('.lui-cartesian-chart__area').first();
  const before = await areaPath.getAttribute('d');
  await page.getByTestId('area-data-toggle').click();
  await expect(areaPath).not.toHaveAttribute('d', before ?? '');
  await root.focus();
  await expect(root).toHaveAttribute('data-focused', 'true');
  await expect(root.getByRole('tooltip')).toHaveCSS('top', '8px');
  await root.press('ArrowRight');
  await root.press('ArrowRight');
  await expect(root.getByRole('tooltip')).toContainText('Mar');
  await page.getByTestId('area-data-shrink').evaluate(
    /** Programmatic click keeps chart focus and exposes a stale active index. */
    (button) => (button as HTMLButtonElement).click(),
  );
  await expect(root.getByRole('tooltip')).toHaveCount(0);
  await expect(root.locator('.lui-cartesian-chart__cursor')).toHaveCount(0);
}

/** Verify Line Chart CSS hooks, custom tooltip CSS, and legend state. */
async function verifiesLineCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-cartesian-css--line');
  const root = page.locator('#cartesian-line-root');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveClass(/lui-line-chart/);
  await expect(root.locator('.lui-cartesian-chart__line').first()).toHaveCSS('fill', 'none');
  await expect(root.locator('.lui-cartesian-chart__line').first()).toHaveCSS('stroke-width', '3px');
  await expect(root.locator('.lui-cartesian-chart__gridLine').first()).toHaveCSS(
    'stroke',
    'rgb(228, 228, 231)',
  );
  await expect(root.locator('.lui-cartesian-chart__pointLabel').first()).toHaveCSS(
    'text-anchor',
    'start',
  );
  await expect(root.locator('.lui-cartesian-chart__pointLabel').first()).toHaveCSS(
    'font-weight',
    '600',
  );
  await root.focus();
  await expect(root.getByRole('tooltip')).toHaveCSS('background-color', 'rgb(123, 45, 67)');
  await root.locator('.lui-cartesian-chart__legendItem').first().hover();
  await expect(root.locator('.lui-cartesian-chart__series').nth(1)).toHaveAttribute(
    'data-muted',
    '',
  );
  await expect(root.locator('.lui-cartesian-chart__series').nth(1)).toHaveCSS('opacity', '0.2');
}

test('Area Chart uses authored CSS and retains native and reactive behavior', verifiesAreaCss);
test('Line Chart uses authored CSS and consumer overrides', verifiesLineCss);

/** Keep chart key handling off when the tooltip interaction is disabled. */
async function verifiesPassiveKeyboard({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-cartesian-css--passive');
  const root = page.locator('#cartesian-passive-root');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await root.focus();
  await root.press('ArrowRight');
  await expect(root).toHaveAttribute('data-keydown', 'ArrowRight');
  await expect(root).toHaveAttribute('data-prevented', 'false');
  await expect(root.getByRole('tooltip')).toHaveCount(0);
}

test('Line Chart keeps native arrow handling when tooltip is disabled', verifiesPassiveKeyboard);

/** Keep default charts at 4:3 while explicit height stays fixed. */
async function verifiesResponsiveFrame({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-cartesian-css--responsive');
  const area = page.locator('#responsive-area');
  const line = page.locator('#responsive-line');
  const fixed = page.locator('#fixed-line');
  await expect(area.locator('svg')).toHaveAttribute('height', '182');
  await expect(line.locator('svg')).toHaveAttribute('height', '210');
  await expect(fixed.locator('svg')).toHaveAttribute('height', '260');
  await area.locator('svg').evaluate(
    /** Mark the SVG to detect replacement during responsive resizing. */
    (element) => element.setAttribute('data-original', 'true'),
  );
  await page.getByTestId('cartesian-width-toggle').click();
  await expect(area.locator('svg')).toHaveAttribute('height', '356');
  await expect(line.locator('svg')).toHaveAttribute('height', '448');
  await expect(fixed.locator('svg')).toHaveAttribute('height', '260');
  await expect(area.locator('svg')).toHaveAttribute('data-original', 'true');
}

test(
  'Cartesian default frames respond to width with an explicit height escape',
  verifiesResponsiveFrame,
);
