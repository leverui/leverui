import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type {
  Button as ButtonExport,
  ButtonProps,
  CloseButton as CloseButtonExport,
  IconButton as IconButtonExport,
} from '../../src';

type ServerActions = {
  Button: typeof ButtonExport;
  CloseButton: typeof CloseButtonExport;
  IconButton: typeof IconButtonExport;
};

const serverEntry = '../../dist/server/index.js';
const { Button, CloseButton, IconButton } = (await import(serverEntry)) as ServerActions;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render a default action without a styling provider. */
function renderButton(): JSX.Element {
  return createComponent(Button, { id: 'plain-button', children: 'Save' });
}

/** Render every responsive Button size from native attributes. */
function renderResponsiveButton(): JSX.Element {
  return createComponent<ButtonProps>(Button, {
    id: 'responsive-button',
    size: { base: 'md', sm: 'xs', md: 'lg', lg: 'xl', xl: 'sm', '2xl': '2xl' },
    children: 'Resize',
  });
}

/** Render all six Button treatments at the supported breakpoints. */
function renderResponsiveVariantButton(): JSX.Element {
  return createComponent<ButtonProps>(Button, {
    id: 'responsive-variant-button',
    colorPalette: 'blue',
    variant: {
      base: 'surface',
      sm: 'outline',
      md: 'solid',
      lg: 'ghost',
      xl: 'subtle',
      '2xl': 'plain',
    },
    children: 'Treatment',
  });
}

/** Render an icon action without a styling provider. */
function renderIconButton(): JSX.Element {
  return createComponent(IconButton, {
    id: 'plain-icon-button',
    'aria-label': 'Options',
    children: '⋯',
  });
}

/** Render a close action without a styling provider. */
function renderCloseButton(): JSX.Element {
  return createComponent(CloseButton, { id: 'plain-close-button' });
}

/** Verify default actions get complete CSS styling from the public file alone. */
async function verifiesProviderFreeButtonCss({ page }: { page: Page }): Promise<void> {
  const markup = [renderButton, renderIconButton, renderCloseButton]
    .map(
      /** Render each action with the published server entry. */
      (render) => renderToString(render),
    )
    .join('');

  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  await expect(page.getByRole('button', { name: 'Save' })).toHaveCSS('height', '40px');
  await expect(page.getByRole('button', { name: 'Options' })).toHaveCSS('padding-left', '0px');
  await expect(page.getByRole('button', { name: 'Close' })).toHaveAttribute(
    'data-variant',
    'ghost',
  );
}

test(
  'Button compositions use the public CSS without a styling provider',
  verifiesProviderFreeButtonCss,
);

/** Verify all ordinary breakpoints style server HTML without browser scripts. */
async function verifiesResponsiveButtonCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderResponsiveButton);
  expect(markup).toContain('data-size-sm="xs"');
  expect(markup).toContain('data-size-2xl="2xl"');
  expect(markup).not.toContain('data-lui-private-style-runtime');
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const button = page.locator('#responsive-button');
  for (const [width, height] of [
    [400, '40px'],
    [500, '32px'],
    [800, '44px'],
    [1100, '48px'],
    [1300, '36px'],
    [1600, '64px'],
  ] as const) {
    await page.setViewportSize({ width, height: 800 });
    await expect(button).toHaveCSS('height', height);
  }
}

test('responsive Button sizes use authored CSS without JavaScript', verifiesResponsiveButtonCss);

/** Check every treatment from server HTML and the public CSS bundle alone. */
async function verifiesResponsiveVariantCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderResponsiveVariantButton);
  expect(markup).toContain('data-variant-sm="outline"');
  expect(markup).toContain('data-variant-2xl="plain"');
  expect(markup).not.toContain('data-lui-private-style-runtime');
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const button = page.locator('#responsive-variant-button');
  for (const [width, background] of [
    [400, 'rgb(219, 234, 254)'],
    [500, 'rgb(219, 234, 254)'],
    [800, 'rgb(37, 99, 235)'],
    [1100, 'rgba(0, 0, 0, 0)'],
    [1300, 'rgb(219, 234, 254)'],
    [1600, 'rgb(219, 234, 254)'],
  ] as const) {
    await page.setViewportSize({ width, height: 800 });
    await expect(button).toHaveCSS('background-color', background);
  }
  await page.setViewportSize({ width: 500, height: 800 });
  await expect(button).toHaveCSS('border-top-color', 'rgb(59, 130, 246)');
  await page.setViewportSize({ width: 1600, height: 800 });
  await expect(button).toHaveCSS('box-shadow', 'rgb(191, 219, 254) 0px 0px 0px 1px');
}

test(
  'responsive Button variants use authored CSS without JavaScript',
  verifiesResponsiveVariantCss,
);
