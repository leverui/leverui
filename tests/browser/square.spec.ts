import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Square as SquareExport } from '../../src';

type ServerExports = {
  Square: typeof SquareExport;
};

const serverEntry = '../../dist/server/index.js';
const { Square } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Require a measurable native Square box for layout assertions. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected Square layout box is absent.');
  return box;
}

/** Compare browser coordinates with subpixel tolerance. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Verify equal sizing, centering, CSS, responsive props, and native behavior. */
async function verifiesSquare({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-square--contract');
  const token = page.getByTestId('square-token');
  await expect(token).toBeVisible({ timeout: 30_000 });
  await expect(token).toHaveClass(/leverui-square/);
  await expect(token).toHaveCSS('display', 'flex');
  await expect(token).toHaveCSS('align-items', 'center');
  await expect(token).toHaveCSS('justify-content', 'center');
  await expect(token).toHaveCSS('flex-grow', '0');
  await expect(token).toHaveCSS('flex-shrink', '0');
  const outer = await requiredBox(token);
  const inner = await requiredBox(page.getByTestId('square-token-child'));
  expectNear(outer.width, 40);
  expectNear(outer.height, 40);
  expectNear(inner.width, 10);
  expectNear(inner.height, 10);
  expectNear(inner.x + inner.width / 2, outer.x + outer.width / 2);
  expectNear(inner.y + inner.height / 2, outer.y + outer.height / 2);
  const responsive = page.getByTestId('square-responsive');
  expectNear((await requiredBox(responsive)).width, 32);
  expectNear((await requiredBox(responsive)).height, 32);
  expectNear((await requiredBox(page.getByTestId('square-raw'))).width, 64);
  const customCss = page.getByTestId('square-custom-css');
  const styledChild = page.getByTestId('square-custom-css-child');
  await expect(customCss).toHaveCSS('position', 'fixed');
  await expect(customCss).toHaveCSS('justify-content', 'flex-start');
  await expect(customCss).not.toHaveAttribute('css');
  await expect(customCss).not.toHaveAttribute('size');
  await customCss.evaluate(
    /** Mark the styled root before its consumer CSS changes. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await styledChild.evaluate(
    /** Mark the styled child before its parent's CSS changes. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );

  const reactive = page.getByRole('button', { name: 'Resize square' });
  const child = page.getByTestId('square-reactive-child');
  await expect(reactive).toHaveAttribute('data-ref-tag', 'button');
  expectNear((await requiredBox(reactive)).width, 32);
  await reactive.evaluate(
    /** Mark the button before changing its reactive size. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await child.evaluate(
    /** Mark the centered child before its parent changes size. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await reactive.click();
  expectNear((await requiredBox(reactive)).width, 48);
  await expect(customCss).toHaveCSS('justify-content', 'flex-end');
  await expect(customCss).toHaveAttribute('data-original-node', 'true');
  await expect(styledChild).toHaveAttribute('data-original-node', 'true');
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(child).toHaveAttribute('data-original-node', 'true');
  await reactive.focus();
  await expect(reactive).toBeFocused();
  await page.keyboard.press('Enter');
  expectNear((await requiredBox(reactive)).width, 32);

  const link = page.getByRole('link', { name: 'Square link' });
  await expect(link).toHaveCSS('display', 'flex');
  expectNear((await requiredBox(link)).width, 40);
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#square-target$/);

  await page.setViewportSize({ width: 900, height: 700 });
  expectNear((await requiredBox(responsive)).width, 48);
  expectNear((await requiredBox(responsive)).height, 48);
  await page.addStyleTag({ content: ':root { --lui-sizes-10: 3rem; }' });
  expectNear((await requiredBox(token)).width, 48);
}

/** Render a responsive Square through the published server entry. */
function renderServerSquare(): JSX.Element {
  return createComponent(Square, {
    id: 'server-square',
    size: { base: '8', md: '12' },
    style: 'position: fixed',
    children: 'Server square',
  });
}

/** Measure published server styles at both documented breakpoints. */
async function verifiesServerSquare({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerSquare);
  expect(markup).toContain('Server square');
  expect(markup).toMatch(/leverui-square/);
  expect(markup).not.toMatch(/<div[^>]*\s(?:size|css)=/);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const square = page.locator('#server-square');
  await expect(square).toHaveCSS('position', 'fixed');
  expectNear((await requiredBox(square)).width, 32);
  expectNear((await requiredBox(square)).height, 32);
  await page.setViewportSize({ width: 900, height: 700 });
  expectNear((await requiredBox(square)).width, 48);
  expectNear((await requiredBox(square)).height, 48);
}

test('Square preserves equal geometry, CSS, and native behavior', verifiesSquare);
test('published Square renders responsive size and CSS on the server', verifiesServerSquare);
