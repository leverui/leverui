import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { Box as BoxExport } from '../../src';

type ServerExports = {
  Box: typeof BoxExport;
};

const serverEntry = '../../dist/server/index.js';
const { Box } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const consumerCss = `
  :root { --mode-fg: var(--lui-colors-blue-500); }
  :root[data-leverui-color-mode='dark'] { --mode-fg: var(--lui-colors-red-500); }
  .mode-box { background-color: var(--lui-colors-bg); color: var(--mode-fg); }
`;

/** Render semantic and conditional colors without client-side JavaScript. */
function renderModeExample() {
  return createComponent(Box, {
    'data-testid': 'mode-box',
    class: 'mode-box',
    children: 'Mode',
  });
}

/** Restore the documented light fallback when no root mode is set. */
function clearRootMode(): void {
  document.documentElement.removeAttribute('data-leverui-color-mode');
}

/** Select dark mode without mounting a JavaScript provider. */
function setDarkMode(): void {
  document.documentElement.setAttribute('data-leverui-color-mode', 'dark');
}

/** Select explicit light mode without mounting a JavaScript provider. */
function setLightMode(): void {
  document.documentElement.setAttribute('data-leverui-color-mode', 'light');
}

/** Check semantic tokens and consumer CSS across root mode changes. */
async function verifiesRootMode({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderModeExample);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style><style>${consumerCss}</style>${markup}`);

  const box = page.getByTestId('mode-box');
  await page.evaluate(clearRootMode);
  await expect(box).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(box).toHaveCSS('color', 'rgb(59, 130, 246)');

  await page.evaluate(setDarkMode);
  await expect(box).toHaveCSS('background-color', 'rgb(9, 9, 11)');
  await expect(box).toHaveCSS('color', 'rgb(239, 68, 68)');

  await page.evaluate(setLightMode);
  await expect(box).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(box).toHaveCSS('color', 'rgb(59, 130, 246)');
}

test('root color mode changes tokens and consumer CSS before hydration', verifiesRootMode);
