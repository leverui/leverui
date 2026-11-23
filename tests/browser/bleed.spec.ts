import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString, type JSX } from '@solidjs/web';
import type { Bleed as BleedExport } from '../../src';

type ServerExports = {
  Bleed: typeof BleedExport;
};

const serverEntry = '../../dist/server/index.js';
const { Bleed } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Read a visible element's measured CSS box. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected bleed layout box is absent.');
  return box;
}

/** Accept subpixel browser rounding in measured layout. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Verify token, unit, logical, responsive, and live negative margins. */
async function verifiesBleed({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-bleed--contract');
  const inline = page.getByTestId('inline-bleed');
  await expect(inline).toBeVisible({ timeout: 30_000 });
  await expect(inline).toHaveCSS('margin-inline-start', '-40px');
  await expect(inline).toHaveCSS('margin-inline-end', '-40px');
  const inlineParent = await requiredBox(page.getByTestId('inline-parent'));
  const inlineBox = await requiredBox(inline);
  expectNear(inlineBox.x, inlineParent.x);
  expectNear(inlineBox.width, inlineParent.width);
  await expect(page.getByTestId('block-bleed')).toHaveCSS('margin-block-start', '-40px');
  await expect(page.getByTestId('block-bleed')).toHaveCSS('margin-block-end', '-40px');
  const blockParent = await requiredBox(page.getByTestId('block-parent'));
  const block = await requiredBox(page.getByTestId('block-bleed'));
  expectNear(block.y, blockParent.y);

  const start = page.getByTestId('start-bleed');
  const end = page.getByTestId('end-bleed');
  await expect(start).toHaveCSS('margin-inline-start', '-32px');
  await expect(start).toHaveCSS('margin-block-start', '-32px');
  await expect(start).toHaveCSS('margin-inline-end', '0px');
  await expect(end).toHaveCSS('margin-inline-end', '-32px');
  await expect(end).toHaveCSS('margin-block-end', '-32px');
  await expect(end).toHaveCSS('margin-inline-start', '0px');
  const rtlParent = await requiredBox(page.getByTestId('rtl-parent'));
  const rtl = await requiredBox(page.getByTestId('rtl-bleed'));
  expectNear(rtl.x + rtl.width, rtlParent.x + rtlParent.width);
  await expect(page.getByTestId('rtl-bleed')).toHaveCSS('margin-right', '-32px');
  const rtlEndParent = await requiredBox(page.getByTestId('rtl-end-parent'));
  const rtlEnd = await requiredBox(page.getByTestId('rtl-end-bleed'));
  expectNear(rtlEnd.x, rtlEndParent.x);
  await expect(page.getByTestId('rtl-end-bleed')).toHaveCSS('margin-left', '-32px');
  await expect(page.getByTestId('precedence-bleed')).toHaveCSS('margin-inline-start', '-16px');
  await expect(page.getByTestId('precedence-bleed')).toHaveCSS('margin-inline-end', '-16px');
  await expect(page.getByTestId('precedence-bleed')).toHaveCSS('margin-block-start', '-16px');
  await expect(page.getByTestId('precedence-bleed')).toHaveCSS('margin-block-end', '-16px');

  const responsive = page.getByTestId('responsive-bleed');
  await expect(responsive).toHaveCSS('margin-inline-start', '-8px');
  await expect(responsive).toHaveCSS('margin-block-start', '-8px');
  const raw = page.getByTestId('raw-bleed');
  await expect(raw).toHaveCSS('margin-inline-start', '-12px');
  await expect(raw).toHaveCSS('margin-block-end', '-18px');

  const reactive = page.getByTestId('reactive-bleed');
  await expect(reactive).toHaveJSProperty('tagName', 'SECTION');
  await expect(reactive).toHaveAttribute('data-ref-tag', 'section');
  await expect(reactive).toHaveAttribute('aria-label', 'Reactive bleed');
  await expect(reactive).toHaveClass(/consumer-bleed/);
  await expect(reactive).not.toHaveAttribute('inline');
  await expect(reactive).toHaveCSS('margin-inline-start', '-8px');
  await reactive.evaluate(
    /** Mark the mounted element to detect replacement after a signal update. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await page.getByTestId('bleed-toggle').click();
  await expect(reactive).toHaveCSS('margin-inline-start', '-24px');
  await expect(reactive).toHaveAttribute('data-original-node', 'true');

  const link = page.getByRole('link', { name: 'Bleeding link' });
  await expect(link).toHaveAttribute('href', '#bleed-target');
  await expect(link).toHaveCSS('margin-inline-start', '-32px');
  const nativeStyle = page.getByTestId('native-style-bleed');
  await expect(nativeStyle).toHaveCSS('position', 'fixed');
  await expect(nativeStyle).toHaveCSS('margin-inline-start', '-16px');
  await expect(nativeStyle).toHaveCSS('margin-inline-end', '-16px');
  await expect(nativeStyle).not.toHaveAttribute('css');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#bleed-target$/);

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(responsive).toHaveCSS('margin-inline-start', '-24px');
  await expect(responsive).toHaveCSS('margin-block-start', '-24px');
  await page.addStyleTag({
    content: '.consumer-bleed { margin-inline-start: -35px; }',
  });
  await expect(reactive).toHaveCSS('margin-inline-start', '-35px');
}

/** Render the published component and styles without a styling provider. */
function renderServerBleed(): JSX.Element {
  return createComponent(Dynamic, {
    component: 'div',
    id: 'server-bleed-parent',
    style: { width: '240px', padding: '32px' },
    /** Render responsive token spacing through the package entry. */
    get children() {
      return createComponent(Bleed, {
        id: 'server-bleed',
        inline: { base: '4', md: '8' },
        children: 'Server bleed',
      });
    },
  });
}

/** Measure published server markup before and after a viewport breakpoint. */
async function verifiesServerBleed({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerBleed);
  expect(markup).toContain('Server bleed');
  expect(markup).not.toMatch(/<div[^>]*\sinline=/);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const root = page.locator('#server-bleed');
  await expect(root).toHaveCSS('margin-inline-start', '-16px');
  const parent = await requiredBox(page.locator('#server-bleed-parent'));
  const bleed = await requiredBox(root);
  expectNear(bleed.x, parent.x + 16);
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(root).toHaveCSS('margin-inline-start', '-32px');
  expectNear((await requiredBox(root)).x, parent.x);
}

/** Verify native Bleed CSS follows consumer tokens without a component style tag. */
async function verifiesNativeBleedCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Keep both roots in one tree and test inherited private values. */
    () =>
      createComponent(Bleed, {
        id: 'native-bleed',
        inline: '2',
        /** The nested root must keep zero margins. */
        get children() {
          return createComponent(Bleed, {
            id: 'nested-native-bleed',
            children: 'Nested bleed',
          });
        },
      }),
  );
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>#native-bleed { --lui-spacing-2: 13px; }</style>${markup}`,
  );
  const outer = page.locator('#native-bleed');
  await expect(outer).toHaveCSS('margin-inline-start', '-13px');
  await expect(outer).toHaveCSS('margin-inline-end', '-13px');
  await expect(page.locator('#nested-native-bleed')).toHaveCSS('margin-inline-start', '0px');
  expect(
    await outer.evaluate(
      /** Read the class hook without depending on HTML whitespace. */
      (element) => [...element.classList],
    ),
  ).toEqual(['lui-bleed']);
}

test('Bleed preserves logical layout, responsive spacing, and reactive styles', verifiesBleed);
test('published Bleed renders responsive negative margins on the server', verifiesServerBleed);
test('native Bleed CSS follows tokens without injecting component styles', verifiesNativeBleedCss);
