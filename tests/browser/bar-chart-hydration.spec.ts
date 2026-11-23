import { readFile } from 'node:fs/promises';
import { expect, test, type Browser, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { BarChartHydrationComponents } from '../../.storybook/bar-chart-hydration-tree';
import { renderBarChartHydrationTree } from '../../.storybook/bar-chart-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as BarChartHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser chart to pre-existing server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/bar-chart-hydration-example.tsx';
  const { hydrateBarChartExample } = await import(modulePath);
  const target = document.getElementById('bar-chart-hydration-root');
  if (!target) throw new Error('The Bar Chart hydration root is missing.');
  hydrateBarChartExample(target);
}

/** Preserve native root and SVG identity while width measurement becomes live. */
async function verifiesBarChartHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the exact published Bar Chart tree on the server. */
    () => renderBarChartHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="bar-chart-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#bar-chart-hydration-root .lui-bar-chart');
  const svg = root.locator('.lui-bar-chart__svg');
  await expect(svg).toHaveAttribute('viewBox', '0 0 700 384');
  await root.evaluate(
    /** Mark the server root before Solid attaches its browser owner. */
    (element) => element.setAttribute('data-server-root', 'true'),
  );
  await svg.evaluate(
    /** Mark the server SVG before responsive measurement updates it. */
    (element) => element.setAttribute('data-server-svg', 'true'),
  );
  const errors: string[] = [];
  /** Record client errors that would invalidate a silent hydration pass. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }
  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#bar-chart-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-root', 'true');
  await expect(svg).toHaveAttribute('data-server-svg', 'true');
  await expect(svg).toHaveAttribute('viewBox', '0 0 320 240');
  await expect(root).toHaveCSS('width', '320px');
  expect(errors).toEqual([]);
}

/** Prove server markup receives default CSS without client JavaScript. */
async function verifiesStaticBarChartCss({ browser }: { browser: Browser }): Promise<void> {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    const markup = renderToString(
      /** Use the same published chart with no browser attachment. */
      () => renderBarChartHydrationTree(components),
    );
    await page.setContent(`<style>${defaultCss}</style>${markup}`);
    const root = page.locator('.lui-bar-chart');
    await expect(root).toHaveCSS('position', 'relative');
    await expect(root.locator('.lui-bar-chart__axes')).toHaveCSS('font-size', '12px');
    await expect(root.locator('.lui-bar-chart__legend')).toHaveCSS('gap', '12px');
  } finally {
    await context.close();
  }
}

test('published Bar Chart hydrates its native SVG', verifiesBarChartHydration);
test('published Bar Chart CSS paints server markup without JavaScript', verifiesStaticBarChartCss);
