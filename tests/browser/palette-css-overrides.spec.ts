import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { Button as ButtonExport, Theme as ThemeExport } from '../../src';

type ServerExports = {
  Button: typeof ButtonExport;
  Theme: typeof ThemeExport;
};

const serverEntry = '../../dist/server/index.js';
const { Button, Theme } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render default, component-level, and scope-level palette samples. */
function renderPaletteSamples() {
  return [
    createComponent(Button, {
      id: 'default-button',
      colorPalette: 'blue',
      children: 'Default',
    }),
    createComponent(Button, {
      id: 'direct-button',
      class: 'direct-button',
      colorPalette: 'blue',
      children: 'Direct',
    }),
    createComponent(Theme, {
      class: 'brand-scope',
      /** Render the child whose concrete palette token is overridden. */
      get children() {
        return createComponent(Button, {
          id: 'scoped-button',
          colorPalette: 'blue',
          children: 'Scoped',
        });
      },
    }),
  ];
}

/** Verify ordinary consumer CSS changes palette colors at the requested scope. */
async function verifiesPaletteOverrides({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderPaletteSamples);
  const overrides = `
    .direct-button { --lui-colors-color-palette-solid: rgb(98, 84, 199); }
    .brand-scope { --lui-colors-blue-solid: rgb(140, 60, 70); }
  `;
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style><style>${overrides}</style>${markup}`);

  await expect(page.locator('#default-button')).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(page.locator('#direct-button')).toHaveCSS('background-color', 'rgb(98, 84, 199)');
  await expect(page.locator('#scoped-button')).toHaveCSS('background-color', 'rgb(140, 60, 70)');
}

test('consumer CSS overrides palette aliases and scoped palette tokens', verifiesPaletteOverrides);
