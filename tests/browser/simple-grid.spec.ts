import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { SimpleGrid as GridExport } from '../../src';

type ServerExports = {
  SimpleGrid: typeof GridExport;
};

const serverEntry = '../../dist/server/index.js';
const { SimpleGrid } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Read the number of computed tracks in a visible grid. */
async function trackCount(page: Page, testId: string): Promise<number> {
  return page.getByTestId(testId).evaluate(
    /** Count the grid tracks after the browser resolves repeat and auto-fit. */
    (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length,
  );
}

/** Verify count, auto-fit, responsive, token, and native SimpleGrid paths. */
async function verifiesSimpleGrid({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-simplegrid--contract');
  const basic = page.getByTestId('simple-grid-basic');
  await expect(basic).toBeVisible({ timeout: 30_000 });
  await expect(basic).toHaveCSS('display', 'grid');
  await expect(basic).toHaveCSS('grid-template-columns', '122px 122px');
  await expect(basic).toHaveCSS('gap', '16px');
  await expect(basic).toHaveClass(/leverui-simple-grid/);
  await expect(basic).toHaveClass(/leverui-grid/);
  await expect(basic).not.toHaveAttribute('columns');
  await expect(basic).not.toHaveAttribute('minChildWidth');
  await expect(page.getByTestId('simple-grid-responsive')).toHaveCSS(
    'grid-template-columns',
    '196px 196px',
  );
  await expect(page.getByTestId('simple-grid-span')).toHaveCSS('grid-column', 'span 1 / span 1');
  expect(await trackCount(page, 'simple-grid-array')).toBe(2);
  expect(await trackCount(page, 'simple-grid-zero-width')).toBe(2);
  expect(await trackCount(page, 'simple-grid-token')).toBe(2);
  expect(await trackCount(page, 'simple-grid-pixels')).toBe(2);
  expect(await trackCount(page, 'simple-grid-auto-responsive')).toBe(3);
  expect(await trackCount(page, 'simple-grid-skipped-width')).toBe(3);
  await expect(page.getByTestId('simple-grid-override')).toHaveCSS(
    'grid-template-columns',
    '80px 90px',
  );
  await expect(page.getByTestId('simple-grid-direct')).toHaveCSS(
    'grid-template-columns',
    '70px 80px',
  );
  const child = page.getByTestId('simple-grid-child');
  await expect(child).toHaveJSProperty('tagName', 'SECTION');
  await expect(child).toHaveCSS('display', 'grid');
  await expect(child).toHaveClass(/child-grid/);
  await expect(child).toHaveClass(/leverui-simple-grid/);
  const live = page.getByTestId('simple-grid-live');
  await expect(live).toHaveJSProperty('tagName', 'BUTTON');
  await expect(live).toHaveAttribute('data-grid-ref', 'button');
  expect(await trackCount(page, 'simple-grid-live')).toBe(2);
  const liveChild = page.getByTestId('simple-grid-live-child');
  await liveChild.evaluate(
    /** Mark the existing child before the track count changes. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await live.focus();
  await page.keyboard.press('Enter');
  expect(await trackCount(page, 'simple-grid-live')).toBe(3);
  await expect(liveChild).toHaveAttribute('data-original-node', 'true');

  await page.setViewportSize({ width: 900, height: 700 });
  expect(await trackCount(page, 'simple-grid-responsive')).toBe(4);
  await expect(page.getByTestId('simple-grid-span')).toHaveCSS('grid-column', 'span 3 / span 3');
  expect(await trackCount(page, 'simple-grid-array')).toBe(3);
  expect(await trackCount(page, 'simple-grid-auto-responsive')).toBe(2);
  expect(await trackCount(page, 'simple-grid-skipped-width')).toBe(2);
  await page.addStyleTag({ content: ':root { --leverui-sizes-24: 140px; }' });
  expect(await trackCount(page, 'simple-grid-token')).toBe(1);
  await page.addStyleTag({
    content: '.leverui-simple-grid[data-testid="simple-grid-basic"] { gap: 20px; }',
  });
  await expect(basic).toHaveCSS('gap', '20px');
}

/** Render responsive SimpleGrid markup from the published server entry. */
function renderServerGrid(): JSX.Element {
  return createComponent(SimpleGrid, {
    id: 'server-simple-grid',
    columns: { base: 2, md: 3 },
    style: { width: '300px', gap: '8px' },
    /** Supply real tracks for computed browser layout. */
    get children() {
      return 'Server grid';
    },
  });
}

/** Measure responsive tracks from the published server markup and CSS. */
async function verifiesServerGrid({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerGrid);
  expect(markup).toContain('id="server-simple-grid"');
  expect(markup).toContain('leverui-simple-grid');
  expect(markup).not.toMatch(/\s(?:columns|minChildWidth)=/);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  await expect(page.locator('#server-simple-grid')).toHaveCSS('display', 'grid');
  await expect(page.locator('#server-simple-grid')).toHaveCSS(
    'grid-template-columns',
    '146px 146px',
  );
  await page.setViewportSize({ width: 900, height: 700 });
  expect(
    await page.locator('#server-simple-grid').evaluate(
      /** Count the responsive tracks produced by the published CSS. */
      (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length,
    ),
  ).toBe(3);
}

test('SimpleGrid preserves layout and native behavior', verifiesSimpleGrid);
test('published SimpleGrid renders responsive server styles', verifiesServerGrid);
