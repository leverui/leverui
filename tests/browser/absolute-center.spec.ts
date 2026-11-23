import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString, type JSX } from '@solidjs/web';
import type { AbsoluteCenter as CenterExport } from '../../src';

type ServerExports = {
  AbsoluteCenter: typeof CenterExport;
};

const serverEntry = '../../dist/server/index.js';
const { AbsoluteCenter } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Measure a positioned child's leading edges and center relative to its parent. */
async function placement(page: Page, parentId: string, childId: string) {
  const parent = await page.getByTestId(parentId).boundingBox();
  const child = await page.getByTestId(childId).boundingBox();
  if (!parent || !child) throw new Error(`Missing layout box for ${childId}.`);
  return {
    left: child.x - parent.x,
    top: child.y - parent.y,
    centerX: child.x + child.width / 2 - parent.x - parent.width / 2,
    centerY: child.y + child.height / 2 - parent.y - parent.height / 2,
  };
}

/** Require subpixel-accurate placement without depending on the viewport origin. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Verify the axis geometry and native behavior in both directions. */
async function verifiesAbsoluteCenter({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-absolute-center--contract');
  await expect(page.getByTestId('both-center')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('both-center')).toHaveCSS('width', '60px');

  const both = await placement(page, 'both-parent', 'both-center');
  const horizontal = await placement(page, 'horizontal-parent', 'horizontal-center');
  const vertical = await placement(page, 'vertical-parent', 'vertical-center');
  const rtlBoth = await placement(page, 'rtl-both-parent', 'rtl-both-center');
  const rtlHorizontal = await placement(page, 'rtl-horizontal-parent', 'rtl-horizontal-center');
  const rtlVertical = await placement(page, 'rtl-vertical-parent', 'rtl-vertical-center');
  expectNear(both.centerX, 0);
  expectNear(both.centerY, 0);
  expectNear(horizontal.centerX, 0);
  expectNear(horizontal.top, 12);
  expectNear(vertical.left, 12);
  expectNear(vertical.centerY, 0);
  expectNear(rtlBoth.centerX, 0);
  expectNear(rtlBoth.centerY, 0);
  expectNear(rtlHorizontal.centerX, 0);
  expectNear(rtlHorizontal.top, 12);
  expectNear(rtlVertical.centerY, 0);
  await expect(page.getByTestId('rtl-both-center')).toHaveCSS('translate', '50% -50%');
  await expect(page.getByTestId('rtl-horizontal-center')).toHaveCSS('translate', '50%');
  await expect(page.getByTestId('rtl-vertical-center')).toHaveCSS('translate', '0px -50%');
  await expect(page.getByTestId('rtl-vertical-center')).toHaveCSS('right', '12px');

  const native = page.getByTestId('horizontal-center');
  await expect(native).toHaveJSProperty('tagName', 'SECTION');
  await expect(native).toHaveAttribute('data-ref-tag', 'section');
  await expect(native).not.toHaveAttribute('axis');
  await expect(native).toHaveCSS('display', 'flex');
  await expect(native).toHaveCSS('align-items', 'center');
  await expect(native).toHaveCSS('justify-content', 'center');

  const link = page.getByRole('link', { name: 'Centered overlay link' });
  await expect(link).toHaveAttribute('href', '#layout-target');
  await expect(link).toHaveClass(/overlay-link/);
  expectNear((await placement(page, 'overlay-parent', 'overlay-link')).centerX, 0);
  expectNear((await placement(page, 'overlay-parent', 'overlay-link')).centerY, 0);
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#layout-target$/);

  const reactive = page.getByTestId('reactive-center');
  await expect(reactive).toHaveCSS('padding-left', '8px');
  await reactive.evaluate(
    /** Mark the original node so a reactive update cannot silently replace it. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await page.getByTestId('axis-toggle').click();
  await expect(reactive).toHaveCSS('padding-left', '16px');
  await expect(reactive).toHaveCSS('translate', '-50%');
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  expectNear((await placement(page, 'reactive-parent', 'reactive-center')).centerX, 0);

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(page.getByTestId('both-center')).toHaveCSS('width', '80px');
  expectNear((await placement(page, 'both-parent', 'both-center')).centerX, 0);
  await page.addStyleTag({ content: '.lui-absolute-center.overlay-link { background: red; }' });
  await expect(link).toHaveCSS('background-color', 'rgb(255, 0, 0)');
}

/** Render one default center through the published server package. */
function renderServerCenter(): JSX.Element {
  return createComponent(Dynamic, {
    component: 'div',
    style: { position: 'relative', width: '240px', height: '160px' },
    'data-testid': 'server-parent',
    /** Place the centered child inside a native positioned parent. */
    get children() {
      return createComponent(AbsoluteCenter, {
        style: { width: '60px', height: '40px' },
        'data-testid': 'server-center',
        children: 'Server centered',
      });
    },
  });
}

/** Verify published server markup and generated CSS reproduce browser placement. */
async function verifiesServerCenter({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerCenter);
  expect(markup).toContain('Server centered');
  expect(markup).not.toMatch(/<div[^>]*\saxis=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const centered = page.getByTestId('server-center');
  await expect(centered).toHaveCSS('position', 'absolute');
  const result = await placement(page, 'server-parent', 'server-center');
  expectNear(result.centerX, 0);
  expectNear(result.centerY, 0);
}

test(
  'AbsoluteCenter preserves axes, RTL, native props, and reactive styling',
  verifiesAbsoluteCenter,
);
test('published AbsoluteCenter renders centered layout on the server', verifiesServerCenter);
