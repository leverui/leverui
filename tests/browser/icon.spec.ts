import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Icon as IconExport, IconPropsProvider as PropsProviderExport } from '../../src';

type ServerExports = {
  Icon: typeof IconExport;
  IconPropsProvider: typeof PropsProviderExport;
};

const serverEntry = '../../dist/server/index.js';
const { Icon, IconPropsProvider } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Check SVG semantics, recipe sizes, composition, and mounted updates. */
async function verifiesIconBrowserContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-icon--contract');
  const defaultIcon = page.getByTestId('icon-default');
  await expect(defaultIcon).toBeVisible({ timeout: 20_000 });
  await expect(defaultIcon).toHaveJSProperty('tagName', 'svg');
  await expect(defaultIcon).toHaveAttribute('focusable', 'false');
  await expect(defaultIcon).toHaveAttribute('aria-hidden', 'true');
  await expect(defaultIcon).toHaveCSS('width', '16px');
  await expect(defaultIcon).toHaveCSS('height', '16px');
  await expect(defaultIcon).not.toHaveAttribute('size');
  await expect(page.getByRole('img', { name: 'Saved' })).toHaveAttribute('aria-hidden', 'false');

  const expectedSizes = [
    ['xs', '12px'],
    ['sm', '16px'],
    ['md', '20px'],
    ['lg', '24px'],
    ['xl', '28px'],
    ['2xl', '32px'],
  ] as const;
  for (const [size, width] of expectedSizes) {
    const icon = page.getByTestId(`icon-size-${size}`);
    await expect(icon).toHaveCSS('width', width);
    await expect(icon).toHaveCSS('height', width);
    await expect(icon).not.toHaveAttribute('size');
  }
  await expect(page.getByTestId('icon-custom-size')).toHaveCSS('width', '30px');
  await expect(page.getByTestId('icon-unstyled')).toHaveCSS('display', 'block');
  await expect(page.getByTestId('icon-unstyled')).toHaveCSS('color', 'rgb(5, 6, 7)');
  await expect(page.getByTestId('icon-unstyled')).toHaveCSS('width', '20px');
  await expect(page.getByTestId('icon-unstyled')).not.toHaveAttribute('width');
  await page.setViewportSize({ width: 600, height: 800 });
  await expect(page.getByTestId('icon-responsive')).toHaveCSS('width', '12px');
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(page.getByTestId('icon-responsive')).toHaveCSS('width', '24px');
  await expect(page.getByTestId('icon-colored')).toHaveCSS('color', 'rgb(239, 68, 68)');
  await expect(page.getByTestId('icon-css')).toHaveCSS('color', 'rgb(1, 2, 3)');
  await expect(page.getByTestId('icon-custom-svg')).toHaveAttribute('viewBox', '0 0 32 32');
  await expect(page.getByTestId('icon-custom-svg')).toHaveCSS('width', '24px');
  await expect(page.getByTestId('icon-created').locator('path')).toHaveAttribute(
    'd',
    'M3 3h18v18H3z',
  );
  await expect(page.getByTestId('icon-fallback').locator('path')).toHaveAttribute(
    'd',
    'M1 1h2v2H1z',
  );
  await expect(page.getByTestId('icon-provider-as')).toHaveJSProperty('tagName', 'SPAN');
  await expect(page.getByTestId('icon-provider-as-override')).toHaveJSProperty('tagName', 'svg');
  await expect(page.getByTestId('icon-provider-as')).toHaveAttribute('title', 'Shared tag');
  await expect(page.getByTestId('icon-provider-as')).not.toHaveAttribute('as');

  const inherited = page.getByTestId('icon-inherited');
  const fixed = page.getByTestId('icon-fixed');
  await expect(inherited).toHaveCSS('width', '12px');
  await expect(fixed).toHaveCSS('width', '16px');
  await inherited.evaluate(
    /** Mark the original native SVG before updating provider defaults. */
    (element) => element.setAttribute('data-original-icon', 'true'),
  );
  await page.getByTestId('icon-toggle').click();
  await expect(inherited).toHaveCSS('width', '24px');
  await expect(inherited).toHaveAttribute('data-original-icon', 'true');
  await expect(fixed).toHaveCSS('width', '16px');
}

/** Render an inherited SVG through the published server entry. */
function renderServerIcon(): JSX.Element {
  return createComponent(IconPropsProvider, {
    value: { size: 'lg', title: 'Server icon' },
    /** Preserve the native SVG and its decorative defaults. */
    get children() {
      return createComponent(Icon, { id: 'server-icon', viewBox: '0 0 24 24' });
    },
  });
}

/** Verify package CSS styles server markup without client JavaScript. */
async function verifiesServerIcon({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerIcon);
  expect(markup).toMatch(/<svg[^>]*id="server-icon"/);
  expect(markup).toContain('title="Server icon"');
  expect(markup).toContain('aria-hidden="true"');
  expect(markup).not.toMatch(/<svg[^>]*\ssize=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  await expect(page.locator('#server-icon')).toHaveCSS('width', '24px');
  await expect(page.locator('#server-icon')).toHaveCSS('height', '24px');
}

test('Icon browser contract', verifiesIconBrowserContract);
test.describe('published Icon without JavaScript' /** Render server markup in a browser context where scripts are disabled. */, () => {
  test.use({ javaScriptEnabled: false });
  test('server rendering', verifiesServerIcon);
});
