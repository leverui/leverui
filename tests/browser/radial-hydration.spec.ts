import { readFile } from 'node:fs/promises';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import { expect, test, type Page } from '@playwright/test';
import type { RadialHydrationComponents } from '../../.storybook/radial-hydration-tree';
import { renderRadialHydrationTree } from '../../.storybook/radial-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const components = (await import(serverEntry)) as RadialHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser entry inside Storybook's Vite module graph. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/radial-hydration-example.tsx';
  const { hydrateRadialExample } = await import(modulePath);
  const target = document.getElementById('radial-hydration-root');
  if (!target) throw new Error('Radial hydration target is missing.');
  hydrateRadialExample(target);
}

/** Preserve server SVGs and unique curved label IDs after Solid hydration. */
async function verifiesPublishedRadialHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same finite chart tree through the installed server entry. */
    () =>
      renderRadialHydrationTree(
        components,
        () => 200,
        () => undefined,
      ),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="radial-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#radial-hydration-root');
  const radial = root.locator('.lui-radial-chart');
  const bars = root.locator('.lui-radial-bar-chart');
  const radialSvg = radial.locator('svg');
  const barSvg = bars.locator('svg');
  await expect(radialSvg).toHaveAttribute('width', '200');
  await expect(barSvg).toHaveAttribute('width', '320');
  await radial.evaluate(
    /** Mark the existing server root before client attachment. */
    (element) => element.setAttribute('data-server-radial', 'true'),
  );
  await radialSvg.evaluate(
    /** Mark the existing server SVG before client attachment. */
    (element) => element.setAttribute('data-server-svg', 'true'),
  );
  await barSvg.evaluate(
    /** Mark the existing ring SVG before client attachment. */
    (element) => element.setAttribute('data-server-svg', 'true'),
  );
  const errors: string[] = [];
  /** Record hydration failures surfaced as page errors. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }
  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(radial).toHaveAttribute('data-server-radial', 'true');
  await expect(radialSvg).toHaveAttribute('data-server-svg', 'true');
  await expect(barSvg).toHaveAttribute('data-server-svg', 'true');
  await page.getByTestId('radial-hydration-resize').click();
  await expect(radialSvg).toHaveAttribute('width', '240');
  await expect(barSvg).toHaveAttribute('width', '360');
  expect(errors).toEqual([]);
}

test('published radial SVG nodes hydrate and resize in place', verifiesPublishedRadialHydration);
