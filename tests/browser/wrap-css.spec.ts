import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString, type JSX } from '@solidjs/web';
import type { Wrap as WrapExport } from '../../src/components/wrap';
import type { WrapItem as WrapItemExport } from '../../src/components/wrap-item';

type ServerExports = {
  Wrap: typeof WrapExport;
  WrapItem: typeof WrapItemExport;
};

const serverEntry = '../../dist/server/index.js';
const { Wrap, WrapItem } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const consumerCss = `
  .responsive-item { --leverui-wrap-item-align: flex-start; }
  @media (min-width: 48rem) {
    .responsive-item { --leverui-wrap-item-align: center; }
  }
`;

/** Render default, responsive, and unstyled Wrap paths through the server entry. */
function renderPlainWraps(): JSX.Element {
  return [
    createComponent(Wrap, {
      id: 'plain-wrap',
      class: 'consumer-wrap',
      children: createComponent(WrapItem, {
        id: 'plain-item',
        class: 'consumer-item',
        children: 'Item',
      }),
    }),
    createComponent(Wrap, {
      id: 'responsive-wrap',
      gap: { base: '2', md: '4' },
      rowGap: { base: '4px', md: '12px' },
      columnGap: { base: '8px', md: '16px' },
      align: 'center',
      justify: { base: 'center', md: 'space-between' },
      direction: { base: 'row', md: 'row-reverse' },
      children: createComponent(WrapItem, {
        id: 'responsive-item',
        class: 'responsive-item',
        children: 'Responsive item',
      }),
    }),
    createComponent(Wrap, { id: 'unstyled-wrap', unstyled: true, children: 'Unstyled' }),
    createComponent(WrapItem, {
      id: 'unstyled-item',
      unstyled: true,
      children: 'Unstyled item',
    }),
    createComponent(Wrap, {
      id: 'cascade-wrap',
      gap: { base: '2', md: '4' },
      rowGap: '4px',
      children: 'Cascade',
    }),
    createComponent(Wrap, {
      id: 'unstyled-gap-wrap',
      unstyled: true,
      gap: '4',
      children: 'Unstyled gap',
    }),
  ];
}

/** Check server HTML, responsive layout, and consumer CSS without hydration. */
async function verifiesWrapCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderPlainWraps);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style><style>${consumerCss}</style>${markup}`);
  const plain = page.locator('#plain-wrap');
  const responsive = page.locator('#responsive-wrap');
  const item = page.locator('#responsive-item');
  await expect(plain).toHaveCSS('display', 'flex');
  await expect(plain).toHaveCSS('flex-wrap', 'wrap');
  await expect(plain).toHaveCSS('gap', '8px');
  await expect(page.locator('#plain-item')).toHaveCSS('align-items', 'flex-start');
  await expect(responsive).toHaveCSS('row-gap', '4px');
  await expect(responsive).toHaveCSS('column-gap', '8px');
  await expect(responsive).toHaveCSS('justify-content', 'center');
  await expect(item).toHaveCSS('align-items', 'flex-start');
  await expect(page.locator('#cascade-wrap')).toHaveCSS('row-gap', '4px');
  await expect(page.locator('#unstyled-gap-wrap')).toHaveCSS('gap', '16px');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(responsive).toHaveCSS('row-gap', '12px');
  await expect(responsive).toHaveCSS('column-gap', '16px');
  await expect(responsive).toHaveCSS('justify-content', 'space-between');
  await expect(responsive).toHaveCSS('flex-direction', 'row-reverse');
  await expect(item).toHaveCSS('align-items', 'center');
  await expect(page.locator('#cascade-wrap')).toHaveCSS('row-gap', '4px');
  await expect(page.locator('#cascade-wrap')).toHaveCSS('column-gap', '16px');
  await expect(page.locator('#unstyled-wrap')).toHaveCSS('display', 'block');
  await expect(page.locator('#unstyled-item')).toHaveCSS('display', 'block');
  await page.addStyleTag({
    content: '.consumer-wrap { display: grid; gap: 20px; } .consumer-item { align-items: center; }',
  });
  await expect(plain).toHaveCSS('display', 'grid');
  await expect(plain).toHaveCSS('gap', '20px');
  await expect(page.locator('#plain-item')).toHaveCSS('align-items', 'center');
}

test('Wrap and WrapItem use authored CSS before hydration', verifiesWrapCss);

/** Render an unstyled Wrap root with a native padding style. */
function renderNativeUnstyledWrap(): JSX.Element {
  return createComponent(Wrap, {
    id: 'native-unstyled-wrap',
    unstyled: true,
    style: { padding: '16px' },
    children: createComponent(Dynamic, { component: 'span', children: 'Native style' }),
  });
}

/** Keep authored defaults suppressed while a native style remains effective. */
async function verifiesNativeUnstyled({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderNativeUnstyledWrap);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const wrap = page.locator('#native-unstyled-wrap');
  await expect(wrap).toHaveAttribute('data-unstyled', '');
  await expect(wrap).toHaveCSS('display', 'block');
  await expect(wrap).toHaveCSS('padding', '16px');
}

test('unstyled Wrap retains native consumer styles', verifiesNativeUnstyled);
