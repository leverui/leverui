import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { CloseButton as CloseButtonExport, IconButton as IconButtonExport } from '../../src';

type ServerExports = {
  CloseButton: typeof CloseButtonExport;
  IconButton: typeof IconButtonExport;
};

const serverEntry = '../../dist/server/index.js';
const { CloseButton, IconButton } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render both icon actions through the published server entry. */
function renderServerActions(): JSX.Element {
  return [
    createComponent(IconButton, {
      id: 'icon-action',
      class: 'consumer-icon',
      'aria-label': 'Open settings',
      children: '⚙',
    }),
    createComponent(CloseButton, { id: 'close-action', class: 'consumer-close' }),
  ];
}

/** Keep native inline styles on a provider-free icon action. */
function renderNativeAction(): JSX.Element {
  return createComponent(IconButton, {
    id: 'native-icon-action',
    style: { 'background-color': 'rgb(239, 68, 68)' },
    'aria-label': 'Native action',
    children: '⚙',
  });
}

/** Verify default presentation and consumer overrides require only published CSS. */
async function verifiesIconActionCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerActions);
  expect(markup).toContain('lui-icon-button');
  expect(markup).toContain('lui-close-button');
  expect(markup).not.toContain('data-lui-private-style-runtime');
  expect(markup).not.toMatch(/<style[^>]*>[^<]+<\/style>/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const icon = page.locator('#icon-action');
  const close = page.locator('#close-action');
  await expect(icon).toHaveCSS('padding-left', '0px');
  await expect(icon).toHaveCSS('padding-top', '0px');
  await expect(close).toHaveCSS('padding-left', '0px');
  await expect(close).toHaveAttribute('aria-label', 'Close');
  await expect(close).toHaveAttribute('data-variant', 'ghost');
  await page.addStyleTag({
    content:
      '.consumer-icon { background-color: rgb(30, 50, 70); } .consumer-close { background-color: rgb(70, 50, 30); }',
  });
  await expect(icon).toHaveCSS('background-color', 'rgb(30, 50, 70)');
  await expect(close).toHaveCSS('background-color', 'rgb(70, 50, 30)');
}

test('IconButton and CloseButton use authored CSS after server rendering', verifiesIconActionCss);

/** Preserve square icon geometry with a native consumer style. */
async function verifiesNativeIconAction({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderNativeAction);
  expect(markup).not.toContain('data-lui-private-style-runtime');
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const button = page.locator('#native-icon-action');
  await expect(button).toHaveCSS('padding-left', '0px');
  await expect(button).toHaveCSS('background-color', 'rgb(239, 68, 68)');
}

test('IconButton keeps geometry with native style', verifiesNativeIconAction);
