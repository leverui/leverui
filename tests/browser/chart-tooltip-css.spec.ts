import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { ChartTooltipCard as TooltipExport } from '../../src/charts/chart-tooltip-card';

const serverEntry = '../../dist/server/charts/chart-tooltip-card.js';
const { ChartTooltipCard } = (await import(serverEntry)) as {
  ChartTooltipCard: typeof TooltipExport;
};
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Verify static presentation and consumer variables without browser style insertion. */
async function verifiesTooltipCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Keep the initial tooltip positions visible in server markup. */
    () =>
      createComponent(ChartTooltipCard, {
        label: 'Revenue',
        items: [{ name: 'Desktop', value: 12, color: 'rgb(200, 20, 30)' }],
        pointer: { x: 20, y: 20 },
        chartWidth: 300,
        chartHeight: 200,
      }),
  );
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>:root { --lui-chart-tooltip-bg: rgb(12, 34, 56); --lui-chart-tooltip-radius: 9px; }</style><div style="position: relative">${markup}</div>`,
  );
  const tooltip = page.locator('.leverui-chart-tooltip');
  await expect(tooltip).toHaveCSS('left', '30px');
  await expect(tooltip).toHaveCSS('top', '30px');
  await expect(tooltip).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  await expect(tooltip).toHaveCSS('border-radius', '9px');
  await expect(tooltip.locator('.leverui-chart-tooltip__swatch')).toHaveCSS(
    'background-color',
    'rgb(200, 20, 30)',
  );
}

test('shared chart tooltip uses authored CSS and consumer variables', verifiesTooltipCss);
