import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Spacer as SpacerExport } from '../../src';

type ServerExports = {
  Spacer: typeof SpacerExport;
};

const serverEntry = '../../dist/server/index.js';
const { Spacer } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render default and unstyled Spacers without a component style object. */
function renderPlainSpacers(): JSX.Element {
  return [
    createComponent(Spacer, { id: 'plain-spacer', class: 'consumer-spacer' }),
    createComponent(Spacer, { id: 'unstyled-spacer', unstyled: true }),
    createComponent(Spacer, { id: 'responsive-spacer', flex: { base: 1, md: 2 } }),
    createComponent(Spacer, { id: 'unstyled-flex-spacer', unstyled: true, flex: 3 }),
  ];
}

/** Check script-free flex behavior and ordinary consumer CSS overrides. */
async function verifiesSpacerCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderPlainSpacers);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style><div style="display:flex">${markup}</div>`);
  const plain = page.locator('#plain-spacer');
  const unstyled = page.locator('#unstyled-spacer');
  await expect(plain).toHaveCSS('flex-grow', '1');
  await expect(plain).toHaveCSS('justify-self', 'stretch');
  await expect(plain).toHaveCSS('align-self', 'stretch');
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).toHaveCSS('flex-grow', '0');
  await expect(page.locator('#responsive-spacer')).toHaveCSS('flex-grow', '1');
  await expect(page.locator('#unstyled-flex-spacer')).toHaveCSS('flex-grow', '3');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(page.locator('#responsive-spacer')).toHaveCSS('flex-grow', '2');
  await page.addStyleTag({ content: '.consumer-spacer { --lui-spacer-flex: 2; }' });
  await expect(plain).toHaveCSS('flex-grow', '2');
  await page.addStyleTag({ content: '.consumer-spacer { flex: 3; }' });
  await expect(plain).toHaveCSS('flex-grow', '3');
}

test('Spacer uses authored CSS before hydration', verifiesSpacerCss);

/** Render an unstyled Spacer with an ordinary native style override. */
function renderNativeUnstyledSpacer(): JSX.Element {
  return createComponent(Spacer, {
    id: 'native-unstyled-spacer',
    unstyled: true,
    style: { padding: '16px' },
  });
}

/** Keep authored defaults suppressed while native consumer styles apply. */
async function verifiesNativeUnstyled({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderNativeUnstyledSpacer);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style><div style="display:flex">${markup}</div>`);
  const spacer = page.locator('#native-unstyled-spacer');
  await expect(spacer).toHaveAttribute('data-unstyled', '');
  await expect(spacer).toHaveCSS('flex-grow', '0');
  await expect(spacer).toHaveCSS('padding', '16px');
}

test('unstyled Spacer accepts native consumer styles', verifiesNativeUnstyled);
