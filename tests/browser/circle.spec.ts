import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Circle as CircleExport } from '../../src';

type ServerExports = {
  Circle: typeof CircleExport;
};

const serverEntry = '../../dist/server/index.js';
const { Circle } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Require a visible browser box for a circle geometry assertion. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected Circle layout box is absent.');
  return box;
}

/** Compare centered midpoints with subpixel browser tolerance. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Verify shape, size props, CSS composition, and native interactions. */
async function verifiesCircle({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-circle--contract');
  const token = page.getByTestId('circle-token');
  await expect(token).toBeVisible({ timeout: 30_000 });
  await expect(token).toHaveCSS('display', 'flex');
  await expect(token).toHaveCSS('align-items', 'center');
  await expect(token).toHaveCSS('justify-content', 'center');
  await expect(token).toHaveCSS('flex-grow', '0');
  await expect(token).toHaveCSS('flex-shrink', '0');
  await expect(token).toHaveCSS('border-radius', '9999px');
  const outer = await requiredBox(token);
  const inner = await requiredBox(page.getByTestId('circle-token-child'));
  expectNear(outer.width, 40);
  expectNear(outer.height, 40);
  expectNear(inner.width, 10);
  expectNear(inner.height, 10);
  expectNear(inner.x + inner.width / 2, outer.x + outer.width / 2);
  expectNear(inner.y + inner.height / 2, outer.y + outer.height / 2);
  const responsive = page.getByTestId('circle-responsive');
  expectNear((await requiredBox(responsive)).width, 32);
  expectNear((await requiredBox(responsive)).height, 32);
  expectNear((await requiredBox(page.getByTestId('circle-raw'))).width, 64);
  await expect(page.getByTestId('circle-radius-override')).toHaveCSS('border-radius', '8px');
  const customCss = page.getByTestId('circle-custom-css');
  await expect(customCss).toHaveCSS('position', 'fixed');
  await expect(customCss).toHaveCSS('border-radius', '9999px');
  await expect(customCss).not.toHaveAttribute('css');
  await expect(customCss).not.toHaveAttribute('size');

  const reactive = page.getByRole('button', { name: 'Resize circle' });
  const child = page.getByTestId('circle-reactive-child');
  await expect(reactive).toHaveAttribute('data-ref-tag', 'button');
  expectNear((await requiredBox(reactive)).width, 32);
  await reactive.evaluate(
    /** Mark the native button to detect replacement after a size update. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await child.evaluate(
    /** Mark the centered child to detect replacement after a size update. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await reactive.click();
  expectNear((await requiredBox(reactive)).width, 48);
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(child).toHaveAttribute('data-original-node', 'true');
  await reactive.focus();
  await expect(reactive).toBeFocused();
  await page.keyboard.press('Enter');
  expectNear((await requiredBox(reactive)).width, 32);

  const link = page.getByRole('link', { name: 'Circle link' });
  await expect(link).toHaveCSS('border-radius', '9999px');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#circle-target$/);

  await page.setViewportSize({ width: 900, height: 700 });
  expectNear((await requiredBox(responsive)).width, 48);
  expectNear((await requiredBox(responsive)).height, 48);
  await page.addStyleTag({ content: ':root { --leverui-sizes-10: 3rem; }' });
  expectNear((await requiredBox(token)).width, 48);
}

/** Render responsive Circle styles from the published server entry. */
function renderServerCircle(): JSX.Element {
  return createComponent(Circle, {
    id: 'server-circle',
    size: { base: '8', md: '12' },
    style: 'position: fixed',
    children: 'Server circle',
  });
}

/** Measure the published server Circle at two breakpoints. */
async function verifiesServerCircle({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerCircle);
  expect(markup).toContain('Server circle');
  expect(markup).not.toMatch(/<div[^>]*\s(?:size|css)=/);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const circle = page.locator('#server-circle');
  await expect(circle).toHaveCSS('position', 'fixed');
  await expect(circle).toHaveCSS('border-radius', '9999px');
  expectNear((await requiredBox(circle)).width, 32);
  expectNear((await requiredBox(circle)).height, 32);
  await page.setViewportSize({ width: 900, height: 700 });
  expectNear((await requiredBox(circle)).width, 48);
  expectNear((await requiredBox(circle)).height, 48);
}

test('Circle preserves square geometry, radius, CSS, and native behavior', verifiesCircle);
test('published Circle renders responsive size and custom CSS on the server', verifiesServerCircle);
