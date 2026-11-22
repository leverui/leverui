import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString, type JSX } from '@solidjs/web';
import { renderResponsiveExample } from '../../demos/responsive-example';
import type { Box as BoxExport, Button as ButtonExport } from '../../src';

type ServerExports = {
  Box: typeof BoxExport;
  Button: typeof ButtonExport;
};

const serverEntry = '../../dist/server/index.js';
const { Box, Button } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const responsiveCss = await readFile(
  new URL('../../demos/responsive-example.css', import.meta.url),
  'utf8',
);

/** Render the shared responsive fixture through server component exports. */
function renderServerExample(): JSX.Element {
  return renderResponsiveExample({ Box, Button });
}

/** Hydrate the shared fixture through Storybook's browser module graph. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/hydration-example.tsx';
  const { hydrateResponsiveExample } = await import(modulePath);
  const root = document.getElementById('hydration-root');
  if (!root) throw new Error('Hydration root was not found.');
  hydrateResponsiveExample(root);
}

/** Mark the server element so hydration must preserve it. */
function markBeforeHydration(element: Element): void {
  element.setAttribute('data-before-hydration', 'true');
}

/** Verify authored responsive CSS choices at breakpoints. */
async function verifiesResponsiveStory({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 400, height: 800 });
  await page.goto('/iframe.html?id=setup-responsive-styles--values');

  const object = page.getByTestId('responsive-object');
  const array = page.getByTestId('responsive-array');
  const range = page.getByTestId('responsive-range');
  const palette = page.getByTestId('responsive-palette');
  const button = page.locator('#responsive-size');
  const scalarPalette = page.locator('#scalar-palette');
  await expect(object).toBeVisible({ timeout: 30_000 });
  await expect(object).toHaveCSS('padding', '8px');
  await expect(array).toHaveCSS('padding', '8px');
  await expect(range).toHaveCSS('padding', '0px');
  await expect(button).toHaveCSS('height', '36px');
  await expect(palette).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(button).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(scalarPalette).toHaveCSS('background-color', 'rgb(37, 99, 235)');

  await page.setViewportSize({ width: 600, height: 800 });
  await expect(button).toHaveCSS('height', '36px');
  await page.setViewportSize({ width: 767, height: 800 });
  await expect(button).toHaveCSS('height', '36px');
  await page.setViewportSize({ width: 768, height: 800 });
  await expect(button).toHaveCSS('height', '44px');

  await page.setViewportSize({ width: 800, height: 800 });
  await expect(object).toHaveCSS('padding', '24px');
  await expect(array).toHaveCSS('padding', '24px');
  await expect(range).toHaveCSS('padding', '32px');
  await expect(button).toHaveCSS('height', '44px');
  await expect(palette).toHaveCSS('background-color', 'rgb(220, 38, 38)');
  await expect(button).toHaveCSS('background-color', 'rgb(220, 38, 38)');
  await expect(scalarPalette).toHaveCSS('background-color', 'rgb(37, 99, 235)');

  await page.setViewportSize({ width: 1400, height: 800 });
  await expect(range).toHaveCSS('padding', '0px');
  await expect(button).toHaveCSS('height', '44px');

  await page.setViewportSize({ width: 400, height: 800 });
  await page.locator('#responsive-toggle').click();
  await expect(page.getByTestId('responsive-state')).toHaveText('4');
  await expect(object).toHaveCSS('padding', '16px');
  await expect(button).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(array).toHaveCSS('padding', '8px');
  await page.locator('#responsive-toggle').click();
  await expect(button).toHaveCSS('background-color', 'rgb(37, 99, 235)');
}

/** Verify server media rules survive hydration and a reactive update. */
async function verifiesResponsiveHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerExample);
  await page.setViewportSize({ width: 400, height: 800 });
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await expect(page.getByTestId('hydration-host')).toBeVisible();
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>${responsiveCss}</style><div id="hydration-root">${markup}</div>`,
  );

  const object = page.getByTestId('responsive-object');
  const palette = page.getByTestId('responsive-palette');
  const button = page.locator('#responsive-size');
  const scalarPalette = page.locator('#scalar-palette');
  await expect(object).toHaveCSS('padding', '8px');
  await expect(button).toHaveCSS('height', '36px');
  await expect(palette).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(button).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(scalarPalette).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await object.evaluate(markBeforeHydration);
  await button.evaluate(markBeforeHydration);

  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(object).toHaveAttribute('data-before-hydration', 'true');
  await expect(button).toHaveAttribute('data-before-hydration', 'true');

  await page.setViewportSize({ width: 800, height: 800 });
  await expect(object).toHaveCSS('padding', '24px');
  await expect(button).toHaveCSS('height', '44px');
  await expect(palette).toHaveCSS('background-color', 'rgb(220, 38, 38)');
  await expect(button).toHaveCSS('background-color', 'rgb(220, 38, 38)');
  await expect(scalarPalette).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await page.setViewportSize({ width: 400, height: 800 });
  await page.locator('#responsive-toggle').click();
  await expect(page.getByTestId('responsive-state')).toHaveText('4');
  await expect(object).toHaveCSS('padding', '16px');
  await expect(button).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(button).toHaveAttribute('data-before-hydration', 'true');
  await page.locator('#responsive-toggle').click();
  await expect(button).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(button).toHaveAttribute('data-before-hydration', 'true');
}

test('responsive CSS follows the documented breakpoints', verifiesResponsiveStory);
test(
  'responsive styles hydrate and update without replacing server markup',
  verifiesResponsiveHydration,
);
