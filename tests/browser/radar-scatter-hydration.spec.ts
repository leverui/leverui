import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { RadarScatterHydrationComponents } from '../../.storybook/radar-scatter-hydration-tree';
import { renderRadarScatterHydrationTree } from '../../.storybook/radar-scatter-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as RadarScatterHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach published browser charts after their server SVGs are in the DOM. */
async function hydrateChartsInBrowser(): Promise<void> {
  const modulePath = '/.storybook/radar-scatter-hydration-example.tsx';
  const { hydrateRadarScatterExample } = await import(modulePath);
  const target = document.getElementById('radar-scatter-hydration-root');
  if (!target) throw new Error('Radar and Scatter hydration target is missing.');
  hydrateRadarScatterExample(target);
}

/** Verify responsive hydration preserves both server chart roots. */
async function verifiesChartHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same chart tree against the published server bundle. */
    () => renderRadarScatterHydrationTree(components),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="radar-scatter-hydration-root" style="width:420px">${markup}</div>`,
  );
  const radar = page.getByRole('img', { name: 'Hydrated radar chart' });
  const scatter = page.getByRole('img', { name: 'Hydrated scatter chart' });
  await expect(radar).toHaveAttribute('viewBox', '0 0 384 288');
  await expect(scatter).toHaveAttribute('viewBox', '0 0 700 384');
  await radar.evaluate(
    /** Tag the server radar SVG before the browser attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  await scatter.evaluate(
    /** Tag the server scatter SVG before its width changes. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];
  /** Record errors thrown while Solid attaches to either chart. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }
  page.on('pageerror', recordError);
  await page.evaluate(hydrateChartsInBrowser);
  await expect(page.locator('#radar-scatter-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(radar).toHaveAttribute('data-server-node', 'true');
  await expect(scatter).toHaveAttribute('data-server-node', 'true');
  await expect(scatter).toHaveAttribute('viewBox', '0 0 420 384');
  expect(errors).toEqual([]);
}

test(
  'published Radar and Scatter Charts hydrate without replacing SVG nodes',
  verifiesChartHydration,
);
