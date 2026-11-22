import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { Box as BoxExport, Theme as ThemeExport } from '../../src';

type ServerExports = {
  Box: typeof BoxExport;
  Theme: typeof ThemeExport;
};

const serverEntry = '../../dist/server/index.js';
const { Box, Theme } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Select dark mode on the document used by the browser test. */
function setDarkMode(): void {
  document.documentElement.setAttribute('data-leverui-color-mode', 'dark');
}

/** Render matching semantic colors at the root and in an inherited scope. */
function renderInheritedColors() {
  return [
    createComponent(Box, { id: 'root-bg', class: 'semantic-background' }),
    createComponent(Theme, {
      id: 'inherited-theme',
      /** Read the parent's semantic background inside the scope. */
      get children() {
        return createComponent(Box, { id: 'inherited-bg', class: 'semantic-background' });
      },
    }),
  ];
}

/** Verify a consumer's root semantic override survives an appearance-free Theme. */
async function verifiesSemanticInheritance({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderInheritedColors);
  const override = `
    html[data-leverui-color-mode='dark'] { --leverui-colors-bg: rgb(60, 70, 80); }
    .semantic-background { background-color: var(--leverui-colors-bg); }
  `;

  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style><style>${override}</style>${markup}`);
  await page.evaluate(setDarkMode);

  await expect(page.locator('#root-bg')).toHaveCSS('background-color', 'rgb(60, 70, 80)');
  await expect(page.locator('#inherited-bg')).toHaveCSS('background-color', 'rgb(60, 70, 80)');
  await expect(page.locator('#inherited-theme')).not.toHaveAttribute(
    'data-leverui-color-mode',
    'dark',
  );
}

test('appearance-free Theme inherits root semantic overrides', verifiesSemanticInheritance);
