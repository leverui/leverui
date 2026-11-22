import { readFile } from 'node:fs/promises';
import { expect, test, type Browser, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { SparklineHydrationComponents } from '../../.storybook/sparkline-hydration-tree';
import { renderSparklineHydrationTree } from '../../.storybook/sparkline-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as SparklineHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the client Sparkline after publishing the server SVG. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/sparkline-hydration-example.tsx';
  const { hydrateSparklineExample } = await import(modulePath);
  const target = document.getElementById('sparkline-hydration-root');
  if (!target) throw new Error('Sparkline hydration target is missing.');
  hydrateSparklineExample(target);
}

/** Check the same SVG survives hydration and observes its container width. */
async function verifiesSparklineHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the published chart before the browser can measure it. */
    () => renderSparklineHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="sparkline-hydration-root" style="width:192px">${markup}</div>`,
  );
  const chart = page.locator('#sparkline-hydration-root svg');
  await expect(chart).toHaveAttribute('viewBox', '0 0 112 48');
  await expect(chart).toHaveCSS('width', '192px');
  await chart.evaluate(
    /** Mark the server node before client hydration attaches. */
    (element) => element.setAttribute('data-server-element', 'true'),
  );
  const errors: string[] = [];
  /** Record any hydration error surfaced to the page. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }
  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#sparkline-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(chart).toHaveAttribute('data-server-element', 'true');
  await expect(chart).toHaveAttribute('viewBox', '0 0 192 48');
  await expect(chart.locator('.leverui-sparkline__gradient-start')).toHaveCSS('stop-opacity', '1');
  expect(errors).toEqual([]);
}

test(
  'published Sparkline hydrates its responsive SVG without replacement',
  verifiesSparklineHydration,
);

/** Verify published CSS paints server markup with JavaScript disabled. */
async function verifiesStaticSparklineCss({ browser }: { browser: Browser }): Promise<void> {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    const markup = renderToString(
      /** Render the same published chart without a client runtime. */
      () => renderSparklineHydrationTree(components),
    );
    await page.setContent(`<style>${defaultCss}</style><div style="width:192px">${markup}</div>`);
    const chart = page.getByRole('img', { name: 'Hydrated Sparkline' });
    await expect(chart).toHaveCSS('width', '192px');
    await expect(chart.locator('.leverui-sparkline__line')).toHaveCSS('stroke-width', '2px');
    await expect(chart.locator('.leverui-sparkline__gradient-start')).toHaveCSS(
      'stop-opacity',
      '1',
    );
  } finally {
    await context.close();
  }
}

test('published Sparkline CSS paints server markup without JavaScript', verifiesStaticSparklineCss);
