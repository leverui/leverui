import { readFile } from 'node:fs/promises';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test, type Browser, type Page } from '@playwright/test';
import type { RadialBarChart as RadialBarChartExport } from '../../src/charts/radial-bar-chart';
import type { RadialChart as RadialChartExport } from '../../src/charts/radial-chart';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as {
  RadialChart: typeof RadialChartExport;
  RadialBarChart: typeof RadialBarChartExport;
};
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Verify authored radial presentation, local overrides, and reactive geometry. */
async function verifiesRadialCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-charts-radial-css--basic');
  const radial = page.locator('.leverui-radial-chart');
  const bar = page.locator('.leverui-radial-bar-chart');
  const sector = radial.locator('.leverui-radial-chart__sector').first();
  await expect(radial).toBeVisible({ timeout: 30_000 });
  await expect(bar).toBeVisible();
  await expect(radial).toHaveAttribute('id', 'radial-native-root');
  await expect(radial).toHaveAttribute('title', 'Operating system share');
  await expect(radial).toHaveAttribute('data-consumer', 'pie');
  await expect(bar).toHaveAttribute('id', 'radial-bar-native-root');
  await expect(bar).toHaveAttribute('data-consumer', 'rings');
  await expect(radial).toHaveAttribute('data-chart-shape', 'donut');
  await expect(sector).toHaveCSS('stroke', 'rgb(37, 99, 235)');
  await expect(radial.locator('.leverui-radial-chart__label').first()).toHaveCSS(
    'font-size',
    '14px',
  );
  await expect(radial.locator('.leverui-radial-chart__centerTitle')).toHaveCSS('font-size', '28px');
  await expect(radial.locator('.leverui-radial-chart__legend')).toHaveCSS('gap', '18px');
  await expect(bar.locator('.leverui-radial-bar-chart__track').first()).toHaveCSS(
    'fill',
    'rgb(225, 231, 236)',
  );
  await expect(bar.locator('.leverui-radial-bar-chart__legend')).toHaveCSS('gap', '20px');
  await radial.evaluate(
    /** Mark the chart root before its reactive choice changes. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await bar.evaluate(
    /** Mark the ring root before its reactive geometry changes. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('radial-point-labels').click();
  await expect(radial.locator('.leverui-radial-chart__labels')).toHaveAttribute(
    'data-placement',
    'point',
  );
  await expect(radial.locator('.leverui-radial-chart__labelLine').first()).toHaveCSS(
    'visibility',
    'visible',
  );
  await page.getByTestId('radial-resize').click();
  await expect(radial).toHaveCSS('width', '240px');
  await expect(radial.locator('svg')).toHaveAttribute('width', '240');
  await expect(bar).toHaveCSS('width', '360px');
  await expect(bar.locator('svg')).toHaveAttribute('width', '360');
  await expect(radial).toHaveAttribute('data-original-node', 'true');
  await expect(bar).toHaveAttribute('data-original-node', 'true');
  await page.getByTestId('radial-local-stroke').click();
  await expect(sector).toHaveCSS('stroke', 'rgb(180, 30, 60)');
  await sector.dispatchEvent('click');
  await expect(radial).toHaveAttribute('data-clicked', 'true');
  await bar.focus();
  await expect(bar.locator('.leverui-chart-tooltip')).toBeVisible();
  await bar.press('ArrowRight');
  await expect(bar).toHaveAttribute('data-key', 'ArrowRight');
  await bar.evaluate(
    /** Leave keyboard focus before simulating a drag outside the chart. */
    (element) => (element as HTMLDivElement).blur(),
  );
  await bar.dispatchEvent('pointerdown');
  await bar.dispatchEvent('pointerleave');
  await bar.focus();
  await expect(bar.locator('.leverui-chart-tooltip')).toBeVisible();
}

test('radial charts use authored CSS with reactive native values', verifiesRadialCss);

/** Keep consumer keyboard semantics when radial tooltip navigation is disabled. */
async function verifiesPassiveRadialKeys({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-charts-radial-css--passive');
  const bar = page.locator('.leverui-radial-bar-chart');
  await expect(bar).toHaveAttribute('aria-label', 'Passive rings');
  await expect(bar).toHaveAttribute('role', 'region');
  await expect(bar).toHaveAttribute('tabindex', '0');
  await bar.focus();
  await bar.press('ArrowRight');
  await expect(bar).toHaveAttribute('data-prevented', 'false');
  await expect(bar.locator('.leverui-chart-tooltip')).toHaveCount(0);
}

test('passive radial bars preserve native keyboard behavior', verifiesPassiveRadialKeys);

/** Keep a CSS-scaled SVG and its HTML tooltip in the same display coordinate space. */
async function verifiesResponsiveRadialTooltip({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-charts-radial-css--responsive');
  const radial = page.locator('.leverui-radial-chart');
  const svg = radial.locator('svg');
  await expect(radial).toHaveCSS('width', '150px');
  await expect(svg).toHaveCSS('width', '150px');
  const box = await svg.boundingBox();
  expect(box).not.toBeNull();
  await radial
    .locator('.leverui-radial-chart__sector')
    .first()
    .dispatchEvent('pointermove', {
      clientX: (box?.x ?? 0) + 20,
      clientY: (box?.y ?? 0) + 20,
    });
  await expect(radial.locator('.leverui-chart-tooltip')).toHaveCSS('left', '0px');
  await page.getByTestId('radial-widen').dispatchEvent('click');
  await expect(radial).toHaveCSS('width', '300px');
  await expect(radial.locator('.leverui-chart-tooltip')).toHaveCSS('left', '50px');
  await page.getByTestId('radial-grow').dispatchEvent('click');
  await expect(svg).toHaveAttribute('width', '500');
  await expect(radial.locator('.leverui-chart-tooltip')).toHaveCSS('left', '50px');
}

test('responsive radial tooltip follows displayed SVG width', verifiesResponsiveRadialTooltip);

/** Render both chart families from the published server entry without client scripts. */
function staticRadialMarkup(): string {
  return renderToString(
    /** Keep static chart data inside one Solid server owner. */
    () => [
      createComponent(server.RadialChart, {
        data: [{ name: 'A', value: 10, color: 'teal.solid' }],
        label: 'point',
        legend: true,
        'aria-label': 'Static pie',
      }),
      createComponent(server.RadialBarChart, {
        data: [{ name: 'B', value: 20, color: 'teal.solid' }],
        label: true,
        legend: true,
        'aria-label': 'Static rings',
      }),
    ],
  );
}

/** Check the published stylesheet paints server HTML with JavaScript disabled. */
async function verifiesStaticRadialCss({ browser }: { browser: Browser }): Promise<void> {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    const consumerCss = `.leverui-radial-chart { --lui-radial-chart-sector-stroke: rgb(37, 99, 235); }
      .leverui-radial-bar-chart { --lui-radial-bar-track-color: rgb(225, 231, 236); }`;
    await page.setContent(
      `<style>${defaultCss}</style><style>${consumerCss}</style><div style="width:140px">${staticRadialMarkup()}</div>`,
    );
    const radial = page.locator('.leverui-radial-chart');
    const bar = page.locator('.leverui-radial-bar-chart');
    await expect(radial).toHaveCSS('width', '140px');
    await expect(radial.locator('svg')).toHaveCSS('width', '140px');
    await expect(bar).toHaveCSS('width', '140px');
    await expect(bar.locator('svg')).toHaveCSS('width', '140px');
    await expect(radial.locator('.leverui-radial-chart__sector')).toHaveCSS(
      'stroke',
      'rgb(37, 99, 235)',
    );
    await expect(radial.locator('.leverui-radial-chart__labelLine')).toHaveCSS(
      'visibility',
      'visible',
    );
    await expect(bar.locator('.leverui-radial-bar-chart__track')).toHaveCSS(
      'fill',
      'rgb(225, 231, 236)',
    );
    await expect(bar.locator('.leverui-radial-bar-chart__label')).toHaveCSS('font-size', '12px');
  } finally {
    await context.close();
  }
}

test('published radial charts paint before JavaScript runs', verifiesStaticRadialCss);
