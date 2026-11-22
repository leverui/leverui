import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString, type JSX } from '@solidjs/web';
import { renderReactiveCssScopeExample } from '../../.storybook/reactive-css-scope-example';
import type { Box as BoxExport, Button as ButtonExport } from '../../src';

type ServerParts = {
  Box: typeof BoxExport;
  Button: typeof ButtonExport;
};

const serverEntry = '../../dist/server/index.js';
const serverParts = (await import(serverEntry)) as ServerParts;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const scopedCss = await readFile(
  new URL('../../.storybook/reactive-css-scope.css', import.meta.url),
  'utf8',
);

/** Render the initial CSS scope through the package server entry. */
function renderServerExample(): JSX.Element {
  return renderReactiveCssScopeExample(serverParts);
}

/** Attach the browser fixture to its server-rendered tree. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/reactive-css-scope-hydration.ts';
  const { hydrateReactiveCssScopeExample } = await import(modulePath);
  const root = document.getElementById('hydration-root');
  if (!root) throw new Error('Hydration root was not found.');
  hydrateReactiveCssScopeExample(root);
}

/** Mark a server element so the test detects a replacement. */
function markElement(element: Element): void {
  element.setAttribute('data-before-hydration', 'true');
}

/** Verify token and Button CSS follow a live wrapper-class round trip. */
async function verifiesReactiveCssScope({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerExample);
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>${scopedCss}</style><div id="hydration-root">${markup}</div>`,
  );

  const scope = page.locator('#css-scope-root');
  const box = page.locator('#css-scope-token');
  const button = page.locator('#css-scope-button');
  await expect(scope).toHaveClass(/reactive-scope-alpha/);
  await expect(box).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await expect(button).toHaveCSS('border-radius', '0px');
  await box.evaluate(markElement);
  await button.evaluate(markElement);

  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await button.click();
  await expect(scope).toHaveClass(/reactive-scope-beta/);
  await expect(box).toHaveCSS('background-color', 'rgb(169, 85, 0)');
  await expect(button).toHaveCSS('border-radius', '16px');
  await button.click();
  await expect(scope).toHaveClass(/reactive-scope-alpha/);
  await expect(box).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await expect(button).toHaveCSS('border-radius', '0px');
  await expect(box).toHaveAttribute('data-before-hydration', 'true');
  await expect(button).toHaveAttribute('data-before-hydration', 'true');
}

test('a CSS scope changes tokens and Button styles reactively', verifiesReactiveCssScope);
