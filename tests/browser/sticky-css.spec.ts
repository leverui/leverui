import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { Sticky as StickyExport } from '../../src';

type ServerExports = {
  Sticky: typeof StickyExport;
};

const serverEntry = '../../dist/server/index.js';
const { Sticky } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render native, consumer-styled, and unstyled Sticky roots without scripts. */
function renderStickyExamples(): string {
  return renderToString(
    /** Keep each server-rendered layout assertion on its own native element. */
    () => [
      createComponent(Sticky, { id: 'native-sticky', children: 'Native' }),
      createComponent(Sticky, {
        id: 'consumer-sticky',
        class: 'consumer-sticky',
        children: 'Consumer CSS',
      }),
      createComponent(Sticky, {
        id: 'unstyled-sticky',
        unstyled: true,
        children: 'Unstyled',
      }),
      createComponent(Sticky, {
        id: 'native-unstyled-sticky',
        unstyled: true,
        style: { top: '12px' },
        children: 'Native style',
      }),
    ],
  );
}

/** Verify default and consumer styles before JavaScript runs. */
async function verifiesStickyCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>.consumer-sticky { --leverui-sticky-top: 21px; }</style>${renderStickyExamples()}`,
  );
  const native = page.locator('#native-sticky');
  await expect(native).toHaveCSS('position', 'sticky');
  await expect(native).toHaveCSS('top', '0px');
  await expect(page.locator('#consumer-sticky')).toHaveCSS('top', '21px');
  await expect(page.locator('#unstyled-sticky')).toHaveCSS('position', 'static');
  await expect(page.locator('#native-unstyled-sticky')).toHaveCSS('position', 'static');
  expect(
    await native.evaluate(
      /** Read the stable class without depending on server HTML whitespace. */
      (element) => [...element.classList],
    ),
  ).toEqual(['leverui-sticky']);
}

test('Sticky defaults and unstyled composition work without scripts', verifiesStickyCss);
