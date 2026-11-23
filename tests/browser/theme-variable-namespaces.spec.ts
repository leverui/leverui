import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { Button as ButtonExport, ButtonProps } from '../../src/components/button';
import type { CardRoot as CardRootExport } from '../../src/components/card-root';
import type { CardRootProps } from '../../src/components/card-props';

type ServerExports = {
  Button: typeof ButtonExport;
  CardRoot: typeof CardRootExport;
};

const serverEntry = '../../dist/server/index.js';
const { Button, CardRoot } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render authored Button and Card surfaces through the public server entry. */
function renderThemeSamples(): string {
  /** Create both samples within Solid's server render owner. */
  function renderTree() {
    return [
      createComponent<ButtonProps>(Button, {
        id: 'theme-button',
        variant: 'solid',
        colorPalette: 'blue',
        children: 'Button',
      }),
      createComponent<CardRootProps>(CardRoot, {
        id: 'theme-shadow',
        variant: 'elevated',
        children: 'Shadow',
      }),
    ];
  }
  return renderToString(renderTree);
}

/** Read the solid Button's resolved background color. */
function readButtonColor(): string {
  const button = document.getElementById('theme-button');
  if (!button) throw new Error('Missing Theme Button fixture');
  return getComputedStyle(button).backgroundColor;
}

/** Read the elevated Card's resolved shadow. */
function readShadow(): string {
  const shadow = document.getElementById('theme-shadow');
  if (!shadow) throw new Error('Missing Theme Card fixture');
  return getComputedStyle(shadow).boxShadow;
}

/** Check generic app variables cannot change a namespaced palette color. */
async function verifiesPaletteNamespace({ page }: { page: Page }): Promise<void> {
  const markup = renderThemeSamples();
  const base = `<style>${defaultCss}</style>`;
  await page.setContent(`${base}${markup}`);
  const defaultColor = await page.evaluate(readButtonColor);
  expect(defaultColor).toBe('rgb(37, 99, 235)');

  await page.setContent(
    `${base}<style>:root { --color-palette-solid: rgb(255, 0, 0); }</style>${markup}`,
  );
  expect(await page.evaluate(readButtonColor)).toBe(defaultColor);

  await page.setContent(
    `${base}<style>:root { --lui-colors-blue-solid: rgb(255, 0, 0); }</style>${markup}`,
  );
  expect(await page.evaluate(readButtonColor)).toBe('rgb(255, 0, 0)');
}

/** Check the elevated Card consumes the public shadow token. */
async function verifiesPublicShadowVariable({ page }: { page: Page }): Promise<void> {
  const markup = renderThemeSamples();
  const base = `<style>${defaultCss}</style>`;
  await page.setContent(`${base}${markup}`);
  const defaultShadow = await page.evaluate(readShadow);
  expect(defaultShadow).not.toBe('none');

  await page.setContent(
    `${base}<style>#theme-shadow { --shadow-color: rgb(255, 0, 0); }</style>${markup}`,
  );
  expect(await page.evaluate(readShadow)).toBe(defaultShadow);

  await page.setContent(
    `${base}<style>:root { --lui-shadows-md: 0 0 0 3px rgb(255, 0, 0); }</style>${markup}`,
  );
  expect(await page.evaluate(readShadow)).toContain('rgb(255, 0, 0)');
}

test('palette token avoids generic app CSS collisions', verifiesPaletteNamespace);
test('elevated Card consumes namespaced public shadow token', verifiesPublicShadowVariable);
