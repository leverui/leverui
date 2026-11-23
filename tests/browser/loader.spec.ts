import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString, type JSX } from '@solidjs/web';
import type { Loader as LoaderExport, LoaderOverlay as LoaderOverlayExport } from '../../src';

type ServerExports = {
  Loader: typeof LoaderExport;
  LoaderOverlay: typeof LoaderOverlayExport;
};

const serverEntry = '../../dist/server/index.js';
const { Loader, LoaderOverlay } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Verify Loader content paths, native behavior, and the overlay layout. */
async function verifiesLoaderBrowserContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-loader--contract');
  const loader = page.getByTestId('default-loader');
  await expect(loader).toBeVisible({ timeout: 30_000 });
  await expect(loader).toHaveAttribute('data-ref-tag', 'span');
  const parent = page.getByTestId('loader-parent');
  await expect(parent).toHaveCSS('position', 'relative');
  await expect(parent).toHaveCSS('width', '160px');
  await expect(parent).toHaveCSS('height', '60px');
  await expect(parent).toHaveCSS('padding', '8px');
  await expect(loader).toHaveCSS('display', 'contents');
  await expect(loader).not.toHaveAttribute('role');
  await expect(loader.locator('.leverui-spinner')).not.toHaveAttribute('aria-hidden');
  await expect(loader.locator('.leverui-spinner')).toHaveCSS('width', '16px');
  await expect(loader.locator('.leverui-spinner')).toHaveCSS('border-top-width', '2px');
  await expect(loader.locator('div')).toHaveCSS('position', 'absolute');
  await expect(loader.locator('.leverui-loader__indicator')).toHaveCSS('display', 'flex');
  await expect(loader.locator('span').last()).toHaveCSS('visibility', 'hidden');
  await expect(page.getByTestId('text-start')).toContainText('Loading...');
  await expect(page.getByTestId('text-end')).toContainText('Loading...');
  await expect(page.getByTestId('custom-indicator')).toHaveText('◌');
  await expect(page.getByTestId('null-indicator')).toHaveText('Ready');
  await expect(page.getByTestId('null-indicator').locator('.leverui-spinner')).toHaveCount(0);
  const unstyledLoader = page.getByTestId('unstyled-loader');
  await expect(unstyledLoader).toHaveClass(/leverui-loader/);
  await expect(unstyledLoader).toHaveAttribute('data-unstyled', '');
  await expect(unstyledLoader).toHaveCSS('display', 'inline');
  await expect(unstyledLoader.locator('.leverui-loader__indicator')).toHaveCSS(
    'position',
    'static',
  );
  await expect(unstyledLoader.locator('.leverui-loader__content')).toHaveCSS(
    'visibility',
    'visible',
  );
  const unstyledOverlay = page.getByTestId('unstyled-overlay');
  await expect(unstyledOverlay).toHaveClass(/leverui-loader-overlay/);
  await expect(unstyledOverlay).toHaveAttribute('data-unstyled', '');
  await expect(unstyledOverlay).toHaveCSS('position', 'static');

  const overlay = page.getByTestId('loader-overlay');
  await expect(overlay).toHaveAttribute('data-ref-tag', 'section');
  await expect(overlay).toHaveCSS('position', 'absolute');
  await expect(overlay).toHaveCSS('display', 'flex');
  await expect(overlay).toHaveCSS('align-items', 'center');
  await expect(overlay).toHaveCSS('justify-content', 'center');
  await expect(overlay).toHaveCSS('width', '200px');
  await expect(overlay).toHaveCSS('height', '100px');
  await expect(overlay).toHaveCSS('gap', '8px');
  await page.addStyleTag({ content: ':root { --lui-spacing-2: 12px; }' });
  await expect(parent).toHaveCSS('padding', '12px');

  await page.getByTestId('loader-toggle').click();
  await expect(page.getByTestId('reactive-loader')).toHaveCount(0);
  await expect(page.getByTestId('reactive-child')).toHaveText('Ready');
  await page.getByTestId('loader-toggle').click();
  await expect(page.getByTestId('reactive-loader')).toContainText('Waiting');
}

/** Render both Loader families through the published server entry. */
function renderServerLoader(): JSX.Element {
  return createComponent(Dynamic, {
    component: 'div',
    style: { position: 'relative', width: '200px', height: '100px' },
    /** Include visible, bypassed, and overlay server states. */
    get children() {
      return [
        createComponent(Loader, { id: 'server-loader', children: 'Submit' }),
        createComponent(Loader, { id: 'server-bypass', visible: false, children: 'Ready' }),
        createComponent(LoaderOverlay, { id: 'server-overlay', children: 'Overlay' }),
      ];
    },
  });
}

/** Check server markup and default stylesheet without a client render. */
async function verifiesServerLoader({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerLoader);
  expect(markup).toContain('id="server-loader"');
  expect(markup).not.toContain('id="server-bypass"');
  expect(markup).toContain('leverui-loader-overlay');
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  await expect(page.locator('#server-loader')).toHaveCSS('display', 'contents');
  await expect(page.locator('#server-loader .leverui-spinner')).toHaveCSS('width', '16px');
  await expect(page.locator('#server-overlay')).toHaveCSS('width', '200px');
  await expect(page.locator('#server-overlay')).toHaveCSS('height', '100px');
}

test('Loader browser contract', verifiesLoaderBrowserContract);
test('published Loader server rendering', verifiesServerLoader);
