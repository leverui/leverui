import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Button as ButtonExport, Theme as ThemeExport } from '../../src';

type ServerExports = {
  Button: typeof ButtonExport;
  Theme: typeof ThemeExport;
};

const serverEntry = '../../dist/server/index.js';
const { Button, Theme } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render Theme's native and appearance contracts through the server package. */
function renderThemeContract(): JSX.Element {
  return createComponent(Theme, {
    as: 'section',
    id: 'theme-contract',
    appearance: 'dark',
    hasBackground: false,
    'aria-label': 'Dark section',
    class: 'consumer-theme responsive-theme',
    style: { 'color-scheme': 'light', 'border-top': '3px solid rgb(98, 84, 199)' },
    children: 'Theme contract',
  });
}

/** Verify native props, CSS responsiveness, and appearance without inserted styles. */
async function verifiesThemeContract({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderThemeContract);
  const consumerCss = `.responsive-theme { padding: var(--lui-spacing-2); }
    @media (min-width: 48em) { .responsive-theme { padding: var(--lui-spacing-4); } }`;
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setViewportSize({ width: 600, height: 700 });
  await page.setContent(`<style>${defaultCss}</style><style>${consumerCss}</style>${markup}`);

  const theme = page.locator('#theme-contract');
  await expect(theme).toHaveJSProperty('tagName', 'SECTION');
  await expect(theme).toHaveAttribute('aria-label', 'Dark section');
  await expect(theme).toHaveAttribute('data-leverui-color-mode', 'dark');
  await expect(theme).toHaveClass(/leverui-theme/);
  await expect(theme).toHaveClass(/consumer-theme/);
  await expect(theme).toHaveCSS('color-scheme', 'dark');
  await expect(theme).toHaveCSS('border-top-width', '3px');
  await expect(theme).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(theme).toHaveCSS('color', 'rgb(250, 250, 250)');
  await expect(theme).toHaveCSS('padding', '8px');

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(theme).toHaveCSS('padding', '16px');
}

test('Theme preserves its native and responsive contract', verifiesThemeContract);

/** Render outer and nested Theme palettes around recipe-driven buttons. */
function renderPaletteContract(): JSX.Element {
  return createComponent(Theme, {
    colorPalette: 'teal',
    /** Render the inherited and overridden palette consumers. */
    get children() {
      return [
        createComponent(Button, { id: 'outer-palette-button', children: 'Outer' }),
        createComponent(Theme, {
          colorPalette: 'pink',
          /** Render a button under the nearest palette scope. */
          get children() {
            return createComponent(Button, { id: 'inner-palette-button', children: 'Inner' });
          },
        }),
      ];
    },
  });
}

/** Verify Button recipes inherit the nearest Theme palette. */
async function verifiesPaletteContract({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderPaletteContract);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);

  await expect(page.locator('#outer-palette-button')).toHaveCSS(
    'background-color',
    'rgb(13, 148, 136)',
  );
  await expect(page.locator('#inner-palette-button')).toHaveCSS(
    'background-color',
    'rgb(219, 39, 119)',
  );
}

test('Theme palettes reach descendants and respect nested overrides', verifiesPaletteContract);
