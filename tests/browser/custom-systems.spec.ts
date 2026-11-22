import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString, type JSX } from '@solidjs/web';
import { renderCustomSystemsExample } from '../../.storybook/custom-systems-example';
import type { Box as BoxExport, Button as ButtonExport, Theme as ThemeExport } from '../../src';

type ServerExports = {
  Box: typeof BoxExport;
  Button: typeof ButtonExport;
  Theme: typeof ThemeExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const scopedCss = await readFile(
  new URL('../../.storybook/custom-systems.css', import.meta.url),
  'utf8',
);

/** Render the shared CSS-scope example through server package exports. */
function renderServerExample(): JSX.Element {
  return renderCustomSystemsExample(server);
}

/** Hydrate the example through Storybook's browser module graph. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/hydration-example.tsx';
  const { hydrateCustomSystemsExample } = await import(modulePath);
  const root = document.getElementById('hydration-root');
  if (!root) throw new Error('Hydration root was not found.');
  hydrateCustomSystemsExample(root);
}

/** Mark an existing element to prove hydration preserves its identity. */
function markElement(element: Element): void {
  element.setAttribute('data-before-hydration', 'true');
}

/** Verify two CSS scopes resolve their own tokens and Button styles. */
async function expectIndependentSystems(page: Page): Promise<void> {
  await expect(page.locator('#default-box')).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(page.locator('#alpha-box')).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await expect(page.locator('#beta-box')).toHaveCSS('background-color', 'rgb(169, 85, 0)');
  await expect(page.locator('#alpha-global')).toHaveCSS('color', 'rgb(18, 52, 86)');
  await expect(page.locator('#beta-global')).toHaveCSS('color', 'rgb(169, 85, 0)');
  await expect(page.locator('#alpha-button')).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await expect(page.locator('#beta-button')).toHaveCSS('background-color', 'rgb(169, 85, 0)');
  await expect(page.locator('#alpha-default-button')).toHaveCSS(
    'background-color',
    'rgb(17, 17, 17)',
  );
  await expect(page.locator('#beta-default-button')).toHaveCSS(
    'background-color',
    'rgb(238, 238, 238)',
  );
  await expect(page.locator('#alpha-button')).toHaveCSS('border-radius', '0px');
  await expect(page.locator('#beta-button')).toHaveCSS('border-radius', '16px');
  await expect(page.locator('#alpha-nested-bg')).toHaveCSS('background-color', 'rgb(9, 9, 11)');
  await expect(page.locator('#beta-nested-bg')).toHaveCSS('background-color', 'rgb(238, 238, 238)');
}

/** Check the two local CSS themes in Storybook's live browser rendering. */
async function verifiesCustomSystemsStory({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-custom-systems--side-by-side');
  await expect(page.locator('#alpha-box')).toBeVisible({ timeout: 30_000 });
  await expectIndependentSystems(page);
}

/** Check scoped CSS overrides and element identity through SSR hydration. */
async function verifiesCustomSystemsHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerExample);
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await expect(page.getByTestId('hydration-host')).toBeVisible();
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>${scopedCss}</style><div id="hydration-root">${markup}</div>`,
  );

  await expectIndependentSystems(page);
  const alpha = page.locator('#alpha-box');
  await alpha.evaluate(markElement);

  await page.addStyleTag({
    content: '.css-scope-alpha { --leverui-colors-blue-600: #333333; }',
  });
  await expect(alpha).toHaveCSS('background-color', 'rgb(51, 51, 51)');
  await expect(page.locator('#beta-box')).toHaveCSS('background-color', 'rgb(169, 85, 0)');

  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(alpha).toHaveAttribute('data-before-hydration', 'true');
  await expect(alpha).toHaveCSS('background-color', 'rgb(51, 51, 51)');
  await expect(page.locator('#alpha-button')).toHaveCSS('background-color', 'rgb(51, 51, 51)');
  await expect(page.locator('#beta-box')).toHaveCSS('background-color', 'rgb(169, 85, 0)');
}

/** Check a real Solid Portal uses the repeated CSS class and explicit mode. */
async function verifiesPortalBridge({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-custom-systems--portal-bridge');
  const portal = page.locator('#portal-bridge');
  await expect(portal).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('#portal-source-root #portalled-button')).toHaveCount(0);
  await expect(portal.locator('#portalled-button')).toHaveCSS(
    'background-color',
    'rgb(18, 52, 86)',
  );
  await expect(portal.locator('#portalled-button')).toHaveCSS('border-radius', '0px');
  await expect(portal.locator('#portalled-dark-bg')).toHaveCSS('background-color', 'rgb(9, 9, 11)');
}

test('two CSS scopes keep tokens and Button styles separate', verifiesCustomSystemsStory);
test('scoped CSS overrides survive hydration', verifiesCustomSystemsHydration);
test('a CSS scope styles content through a Solid Portal', verifiesPortalBridge);
