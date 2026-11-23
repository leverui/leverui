import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { Circle as CircleExport, Square as SquareExport } from '../../src';

type ServerExports = {
  Circle: typeof CircleExport;
  Square: typeof SquareExport;
};

const serverEntry = '../../dist/server/index.js';
const { Circle, Square } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render both shape families without client scripts or style props. */
function renderNativeShapes(): string {
  return renderToString(
    /** Provide the same server context consumers use in a static page. */
    () => [
      createComponent(Square, {
        id: 'css-square',
        class: 'consumer-square',
        size: { base: '8', md: '12' },
        children: 'Square',
      }),
      createComponent(Circle, {
        id: 'css-circle',
        size: '10',
        children: 'Circle',
      }),
      createComponent(Circle, {
        id: 'override-circle',
        class: 'consumer-circle',
        size: '8',
        children: 'Override',
      }),
      createComponent(Square, {
        id: 'fractional-square',
        size: '0.5',
        children: 'Fractional',
      }),
      createComponent(Square, {
        id: 'variable-square',
        class: 'consumer-square-size',
        children: 'Variable',
      }),
      createComponent(Square, {
        id: 'unstyled-square',
        class: 'consumer-unstyled-square',
        unstyled: true,
        size: '8',
        children: 'Unstyled',
      }),
      createComponent(Circle, {
        id: 'native-unstyled-circle',
        class: 'consumer-unstyled-circle',
        unstyled: true,
        size: '8',
        style: { position: 'relative' as const },
        children: 'Unstyled native',
      }),
    ],
  );
}

/** Verify script-free geometry, tokens, radius overrides, and unstyled behavior. */
async function verifiesAuthoredShapes({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>.consumer-square { --lui-sizes-8: 37px; } .consumer-square-size { --lui-square-size: 42px; } .consumer-circle { --lui-circle-radius: 6px; }</style>${renderNativeShapes()}`,
  );
  const square = page.locator('#css-square');
  await expect(square).toHaveCSS('width', '37px');
  await expect(square).toHaveCSS('height', '37px');
  await expect(square).toHaveCSS('display', 'flex');
  await expect(page.locator('#css-circle')).toHaveCSS('border-radius', '9999px');
  await expect(page.locator('#css-circle')).toHaveCSS('width', '40px');
  await expect(page.locator('#override-circle')).toHaveCSS('border-radius', '6px');
  await expect(page.locator('#fractional-square')).toHaveCSS('width', '2px');
  await expect(page.locator('#variable-square')).toHaveCSS('width', '42px');
  await expect(page.locator('#variable-square')).toHaveCSS('height', '42px');
  await expect(page.locator('#unstyled-square')).toHaveCSS('display', 'block');
  await expect(page.locator('#unstyled-square')).toHaveCSS('width', '32px');
  await expect(page.locator('#native-unstyled-circle')).toHaveCSS('display', 'block');
  await expect(page.locator('#native-unstyled-circle')).toHaveCSS('border-radius', '0px');
  await expect(page.locator('#native-unstyled-circle')).toHaveCSS('width', '32px');
  await page.addStyleTag({
    content:
      '.consumer-unstyled-square { display: inline-grid; } .consumer-unstyled-circle { border-radius: 8px; }',
  });
  await expect(page.locator('#unstyled-square')).toHaveCSS('display', 'inline-grid');
  await expect(page.locator('#native-unstyled-circle')).toHaveCSS('border-radius', '8px');
  expect(
    await square.evaluate(
      /** Compare the two public class hooks without depending on SSR whitespace. */
      (element) => [...element.classList],
    ),
  ).toEqual(['leverui-square', 'consumer-square']);
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(square).toHaveCSS('width', '48px');
  await expect(square).toHaveCSS('height', '48px');
}

test('Square and Circle render authored CSS without scripts', verifiesAuthoredShapes);
