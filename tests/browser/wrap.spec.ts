import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Wrap as WrapExport, WrapItem as WrapItemExport } from '../../src';

type ServerExports = {
  Wrap: typeof WrapExport;
  WrapItem: typeof WrapItemExport;
};

const serverEntry = '../../dist/server/index.js';
const { Wrap, WrapItem } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Require a rendered element box for flex layout comparisons. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected Wrap layout box is absent.');
  return box;
}

/** Allow subpixel rounding while comparing browser layout positions. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Verify spacing, line wrapping, aliases, and item styling. */
async function verifiesWrapLayout({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-wrap--contract');
  const wrap = page.getByTestId('wrap-default');
  await expect(wrap).toBeVisible({ timeout: 30_000 });
  await expect(wrap).toHaveClass(/leverui-wrap/);
  await expect(wrap).toHaveCSS('display', 'flex');
  await expect(wrap).toHaveCSS('flex-wrap', 'wrap');
  await expect(wrap).toHaveCSS('gap', '8px');
  const first = await requiredBox(page.getByTestId('wrap-first'));
  const second = await requiredBox(page.getByTestId('wrap-second'));
  const third = await requiredBox(page.getByTestId('wrap-third'));
  expectNear(second.x - first.x, 56);
  expectNear(third.y - first.y, 32);

  const responsive = page.getByTestId('wrap-responsive');
  await expect(responsive).toHaveCSS('row-gap', '4px');
  await expect(responsive).toHaveCSS('column-gap', '8px');
  await expect(responsive).toHaveCSS('justify-content', 'center');
  await expect(responsive).toHaveCSS('align-items', 'center');
  await expect(responsive).toHaveCSS('flex-direction', 'row');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(responsive).toHaveCSS('row-gap', '12px');
  await expect(responsive).toHaveCSS('column-gap', '16px');
  await expect(responsive).toHaveCSS('justify-content', 'space-between');
  await expect(responsive).toHaveCSS('flex-direction', 'row-reverse');

  const item = page.getByTestId('wrap-item-default');
  await expect(item).toHaveClass(/leverui-wrap__listitem/);
  await expect(item).toHaveCSS('display', 'flex');
  await expect(item).toHaveCSS('align-items', 'flex-start');
  await expect(page.getByTestId('wrap-item-css')).toHaveCSS('align-items', 'center');
  await expect(page.getByTestId('wrap-item-root')).toHaveCSS('gap', '10px');
  await expect(page.getByTestId('wrap-override')).toHaveCSS('display', 'grid');
  await expect(page.getByTestId('wrap-override')).toHaveCSS('flex-wrap', 'nowrap');
  await expect(page.getByTestId('wrap-override')).toHaveCSS('gap', '20px');
  await expect(page.getByTestId('wrap-unstyled')).toHaveCSS('display', 'block');
  await expect(page.getByTestId('wrap-unstyled')).toHaveCSS('gap', '16px');
  await expect(page.getByTestId('wrap-item-unstyled')).toHaveCSS('display', 'block');
}

/** Verify native rendering, refs, keyboard access, and reactive styles. */
async function verifiesWrapNativeBehavior({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-wrap--contract');
  const wrap = page.getByTestId('wrap-reactive');
  const button = page.getByRole('button', { name: 'Change wrap gap' });
  const child = page.getByTestId('wrap-button-child');
  await expect(wrap).toHaveCSS('gap', '8px');
  await expect(button).toHaveAttribute('data-ref-tag', 'button');
  await button.evaluate(
    /** Mark the native button before a reactive style update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await child.evaluate(
    /** Mark the child before its parent changes spacing. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await button.click();
  await expect(wrap).toHaveCSS('gap', '16px');
  await expect(button).toHaveAttribute('data-original-node', 'true');
  await expect(child).toHaveAttribute('data-original-node', 'true');
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(wrap).toHaveCSS('gap', '8px');

  const section = page.getByTestId('wrap-as-child');
  await expect(section).toHaveJSProperty('tagName', 'SECTION');
  await expect(section).toHaveCSS('display', 'flex');
  await expect(section).toHaveCSS('gap', '16px');
  await expect(section).toContainText('Section child');
  const link = page.getByRole('link', { name: 'Wrapped link' });
  await expect(link).toHaveCSS('display', 'flex');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#wrap-target$/);
  await page.addStyleTag({
    content: '.leverui-wrap[data-testid="wrap-default"] { --lui-wrap-gap: 13px; }',
  });
  await expect(page.getByTestId('wrap-default')).toHaveCSS('gap', '13px');
  await page.addStyleTag({
    content:
      '.leverui-wrap__listitem[data-testid="wrap-item-default"] { --lui-wrap-item-align: center; }',
  });
  await expect(page.getByTestId('wrap-item-default')).toHaveCSS('align-items', 'center');
  await page.addStyleTag({ content: '.leverui-wrap[data-testid="wrap-default"] { gap: 24px; }' });
  await expect(page.getByTestId('wrap-default')).toHaveCSS('gap', '24px');
  for (const name of ['align', 'justify', 'direction', 'css', 'unstyled', 'asChild']) {
    await expect(section).not.toHaveAttribute(name);
  }
}

/** Render Wrap and WrapItem through the published server package entry. */
function renderServerWrap(): JSX.Element {
  return createComponent(Wrap, {
    id: 'server-wrap',
    title: 'Server wrap',
    gap: { base: '2', md: '4' } as const,
    justify: 'center',
    /** Render the item inside its flex parent on the server. */
    get children() {
      return createComponent(WrapItem, { id: 'server-wrap-item', children: 'Server item' });
    },
  });
}

/** Verify server markup and responsive styles in a browser. */
async function verifiesServerWrap({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerWrap);
  expect(markup).toContain('title="Server wrap"');
  expect(markup).toContain('Server item');
  expect(markup).toMatch(/leverui-wrap__listitem/);
  expect(markup).not.toMatch(/\s(?:align|justify|direction|css|unstyled|asChild)=/);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const wrap = page.locator('#server-wrap');
  await expect(wrap).toHaveCSS('display', 'flex');
  await expect(wrap).toHaveCSS('gap', '8px');
  await expect(wrap).toHaveCSS('justify-content', 'center');
  await expect(page.locator('#server-wrap-item')).toHaveCSS('align-items', 'flex-start');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(wrap).toHaveCSS('gap', '16px');
}

test('Wrap and WrapItem match flex layout', verifiesWrapLayout);
test('Wrap preserves native behavior and reactive styles', verifiesWrapNativeBehavior);
test('published Wrap and WrapItem render responsive server styles', verifiesServerWrap);
