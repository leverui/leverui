import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { Box as BoxExport } from '../../src';

type ServerExports = {
  Box: typeof BoxExport;
};

const serverEntry = '../../dist/server/index.js';
const { Box } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const fixtureCss = await readFile(
  new URL('../../.storybook/hydration-examples.css', import.meta.url),
  'utf8',
);

/** Render the same authored CSS tree used by the browser fixture. */
function renderDefaultExample() {
  return createComponent(Box, {
    'data-testid': 'default-hydrated-box',
    class: 'default-hydrated-box',
    children: 'Default',
  });
}

/** Hydrate the default fixture through Storybook's browser module graph. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/hydration-example.tsx';
  const { hydrateDefaultExample } = await import(modulePath);
  const root = document.getElementById('hydration-root');
  if (!root) throw new Error('Hydration root was not found.');
  hydrateDefaultExample(root);
}

/** Verify external default CSS survives hydration without duplicated styles. */
async function verifiesDefaultHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderDefaultExample);
  expect(markup).not.toContain('--lui-colors-blue-500:');

  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `${generateHydrationScript()}<style data-leverui-default>${defaultCss}</style><style data-leverui-fixture>${fixtureCss}</style><div id="hydration-root">${markup}</div>`,
  );

  const box = page.getByTestId('default-hydrated-box');
  const root = page.locator('#hydration-root');
  await expect(root).not.toHaveAttribute('data-hydrated', 'true');
  await expect(box).toHaveCSS('background-color', 'rgb(59, 130, 246)');
  await expect(box).toHaveCSS('padding', '16px');
  await box.evaluate(
    /** Mark the server node so hydration cannot silently replace it. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );

  await expect(page.locator('style[data-leverui-default]')).toHaveCount(1);
  await expect(page.locator('style[data-leverui-fixture]')).toHaveCount(1);
  const errors: string[] = [];

  /** Record browser errors raised while hydrating the fixture. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);

  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(box).toHaveAttribute('data-server-node', 'true');
  await expect(box).toHaveText('Default');
  await expect(box).toHaveCSS('background-color', 'rgb(59, 130, 246)');
  await expect(box).toHaveCSS('padding', '16px');
  expect(errors).toEqual([]);
  await expect(page.locator('style[data-leverui-default]')).toHaveCount(1);
  await expect(page.locator('style[data-leverui-fixture]')).toHaveCount(1);
}

test('hydrates default styles without duplicate CSS', verifiesDefaultHydration);
