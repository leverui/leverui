import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString, type JSX } from '@solidjs/web';
import { renderScopedHydrationTree } from '../../.storybook/scoped-hydration-tree';
import type { Box as BoxExport, Theme as ThemeExport } from '../../src';

type ServerExports = {
  Box: typeof BoxExport;
  Theme: typeof ThemeExport;
};

const serverEntry = '../../dist/server/index.js';
const { Box, Theme } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const fixtureCss = await readFile(
  new URL('../../.storybook/hydration-examples.css', import.meta.url),
  'utf8',
);

/** Render the shared dark/light tree with server component exports. */
function renderScopedExample(): JSX.Element {
  return renderScopedHydrationTree({ Box, Theme });
}

/** Load the browser fixture through the Storybook module graph. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/hydration-example.tsx';
  const { hydrateScopedExample } = await import(modulePath);
  const root = document.getElementById('hydration-root');
  if (!root) throw new Error('Hydration root was not found.');
  hydrateScopedExample(root);
}

/** Mark a server-rendered element so hydration must preserve its identity. */
function markBeforeHydration(element: Element): void {
  element.setAttribute('data-before-hydration', 'true');
}

/** Check scoped CSS and node identity before and after Solid hydration. */
async function verifiesScopeHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderScopedExample);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>${fixtureCss}</style><div id="hydration-root">${markup}</div>`,
  );

  const scope = page.locator('#hydrated-scope');
  const box = page.locator('#hydrated-scoped-box');
  const innerScope = page.locator('#hydrated-inner-scope');
  const innerBox = page.locator('#hydrated-inner-box');
  await expect(box).toHaveCSS('background-color', 'rgb(9, 9, 11)');
  await expect(box).toHaveCSS('color', 'rgb(239, 68, 68)');
  await expect(innerBox).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(innerBox).toHaveCSS('color', 'rgb(59, 130, 246)');
  await scope.evaluate(markBeforeHydration);
  await innerScope.evaluate(markBeforeHydration);

  await page.evaluate(hydrateInBrowser);

  await expect(page.locator('#hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(scope).toHaveAttribute('data-lui-color-mode', 'dark');
  await expect(scope).toHaveAttribute('data-before-hydration', 'true');
  await expect(innerScope).toHaveAttribute('data-lui-color-mode', 'light');
  await expect(innerScope).toHaveAttribute('data-before-hydration', 'true');
  await expect(box).toHaveCSS('background-color', 'rgb(9, 9, 11)');
  await expect(innerBox).toHaveCSS('background-color', 'rgb(255, 255, 255)');
}

test('nested Theme hydrates without replacing its element or styles', verifiesScopeHydration);
