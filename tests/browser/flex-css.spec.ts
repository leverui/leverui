import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Flex as FlexExport } from '../../src';

type ServerExports = {
  Flex: typeof FlexExport;
};

const serverEntry = '../../dist/server/index.js';
const { Flex } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render native Flex aliases and a nested Flex from the published server entry. */
function renderPlainServerFlexes(): JSX.Element {
  return [
    createComponent(Flex, {
      id: 'plain-server-flex',
      class: 'consumer-flex',
      direction: { base: 'row', md: 'column' },
      align: 'center',
      justify: 'space-between',
      wrap: 'wrap',
      basis: '40px',
      grow: 2,
      shrink: 0,
      inline: true,
      children: createComponent(Flex, {
        id: 'nested-server-flex',
        children: 'Nested flex',
      }),
    }),
    createComponent(Flex, {
      id: 'unstyled-server-flex',
      unstyled: true,
      children: 'Unstyled flex',
    }),
  ];
}

/** Verify authored Flex layout before hydration and consumer CSS precedence. */
async function verifiesPlainFlexCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderPlainServerFlexes);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const root = page.locator('#plain-server-flex');
  await expect(root).toHaveCSS('display', 'inline-flex');
  await expect(root).toHaveCSS('flex-direction', 'row');
  await expect(root).toHaveCSS('align-items', 'center');
  await expect(root).toHaveCSS('justify-content', 'space-between');
  await expect(root).toHaveCSS('flex-wrap', 'wrap');
  await expect(root).toHaveCSS('flex-basis', '40px');
  await expect(root).toHaveCSS('flex-grow', '2');
  await expect(root).toHaveCSS('flex-shrink', '0');
  await expect(page.locator('#nested-server-flex')).toHaveCSS('align-items', 'normal');
  await expect(page.locator('#unstyled-server-flex')).toHaveCSS('display', 'flex');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(root).toHaveCSS('flex-direction', 'column');
  await page.addStyleTag({ content: '.consumer-flex { flex-direction: row-reverse; }' });
  await expect(root).toHaveCSS('flex-direction', 'row-reverse');
}

test('Flex aliases use authored CSS before hydration', verifiesPlainFlexCss);
