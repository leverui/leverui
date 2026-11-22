import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString, type JSX } from '@solidjs/web';
import type { AspectRatio as RatioExport, AspectRatioProps } from '../../src';

type ServerExports = {
  AspectRatio: typeof RatioExport;
};

const serverEntry = '../../dist/server/index.js';
const { AspectRatio } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render one ratio box with a native element child. */
function renderRatio(id: string, ratio?: AspectRatioProps['ratio'], unstyled = false): string {
  /** Render the frame without a styling provider. */
  function renderTree(): JSX.Element {
    return createComponent(AspectRatio, {
      id,
      ratio,
      unstyled,
      style: { width: '240px' },
      /** Keep exactly one native content child. */
      get children() {
        return createComponent(Dynamic, { component: 'div', children: id });
      },
    });
  }

  return renderToString(renderTree);
}

/** Render a selected anchor to verify server geometry without JavaScript. */
function renderAnchor(): string {
  /** Keep the selected link and its child in one server owner. */
  function renderTree(): JSX.Element {
    const props: AspectRatioProps<'a'> = {
      as: 'a',
      href: '#ratio-target',
      id: 'anchor',
      style: { width: '240px' },
      /** Position one native child inside the link. */
      get children() {
        return createComponent(Dynamic, { component: 'span', children: 'Ratio link' });
      },
    };
    return createComponent(AspectRatio, props);
  }

  return renderToString(renderTree);
}

/** Measure the ratio root without relying on an inserted style element. */
async function height(page: Page, id: string): Promise<number> {
  const box = await page.locator(`#${id}`).boundingBox();
  if (!box) throw new Error(`Missing ratio box for ${id}.`);
  return box.height;
}

/** Verify script-free responsive ratios, media layout, and CSS overrides. */
async function verifiesAuthoredAspectRatio({ page }: { page: Page }): Promise<void> {
  const markup = [
    renderRatio('default'),
    renderRatio('responsive', { base: 1, md: 16 / 9 }),
    renderRatio('array', [1, null, 16 / 9]),
    renderRatio('unstyled', undefined, true),
    renderAnchor(),
  ].join('');
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  expect(Math.abs((await height(page, 'default')) - 180)).toBeLessThan(1.5);
  expect(Math.abs((await height(page, 'responsive')) - 240)).toBeLessThan(1.5);
  expect(Math.abs((await height(page, 'array')) - 240)).toBeLessThan(1.5);
  expect(Math.abs((await height(page, 'anchor')) - 180)).toBeLessThan(1.5);
  await expect(page.locator('#anchor')).toHaveAttribute('href', '#ratio-target');
  await expect(page.locator('#responsive > div')).toHaveCSS('position', 'absolute');
  await expect(page.locator('#unstyled')).toHaveCSS('position', 'static');
  await page.setViewportSize({ width: 900, height: 700 });
  expect(Math.abs((await height(page, 'responsive')) - 135)).toBeLessThan(1.5);
  expect(Math.abs((await height(page, 'array')) - 135)).toBeLessThan(1.5);
  await page.addStyleTag({ content: '#responsive::before { padding-bottom: 50%; }' });
  expect(Math.abs((await height(page, 'responsive')) - 120)).toBeLessThan(1.5);
}

test('AspectRatio uses authored CSS before hydration', verifiesAuthoredAspectRatio);
