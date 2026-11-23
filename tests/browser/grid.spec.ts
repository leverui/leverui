import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Grid as GridExport, GridItem as GridItemExport } from '../../src';

type ServerExports = {
  Grid: typeof GridExport;
  GridItem: typeof GridItemExport;
};

const serverEntry = '../../dist/server/index.js';
const { Grid, GridItem } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Require a visible layout box before comparing grid track geometry. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected Grid layout box is absent.');
  return box;
}

/** Verify container aliases, item placement, live props, and native behavior. */
async function verifiesGrid({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-grid--contract');
  const grid = page.getByTestId('grid-basic');
  await expect(grid).toBeVisible({ timeout: 30_000 });
  await expect(grid).toHaveCSS('display', 'grid');
  await expect(grid).toHaveCSS('grid-template-columns', '40px 40px 40px');
  await expect(grid).toHaveCSS('gap', '16px');
  await expect(grid).toHaveClass(/lui-grid/);
  const first = await requiredBox(page.getByTestId('grid-basic-first'));
  const spanning = await requiredBox(page.getByTestId('grid-basic-spanning'));
  expect(Math.abs(spanning.x - first.x - first.width - 16)).toBeLessThan(1.5);
  expect(Math.abs(spanning.width - 96)).toBeLessThan(1.5);
  await expect(page.getByTestId('grid-inline')).toHaveCSS('display', 'inline-grid');

  const aliases = page.getByTestId('grid-aliases');
  await expect(aliases).toHaveCSS('grid-template-columns', '30px 30px');
  await expect(aliases).toHaveCSS('grid-template-rows', '20px 20px');
  await expect(aliases).toHaveCSS('grid-template-areas', '"one two" "three three"');
  await expect(aliases).toHaveCSS('grid-auto-flow', 'dense');
  await expect(aliases).toHaveCSS('grid-auto-rows', '12px');
  await expect(aliases).toHaveCSS('grid-auto-columns', '13px');
  await expect(aliases).toHaveCSS('grid-column', '1 / 3');
  await expect(aliases).toHaveCSS('grid-row', '1 / 3');
  await expect(page.getByTestId('grid-area-one')).toHaveCSS('grid-area', 'one');
  for (const name of [
    'templateColumns',
    'autoFlow',
    'autoRows',
    'autoColumns',
    'templateRows',
    'templateAreas',
    'column',
    'row',
  ]) {
    await expect(aliases).not.toHaveAttribute(name);
  }

  const responsive = page.getByTestId('grid-responsive');
  const span = page.getByTestId('grid-responsive-span');
  await expect(responsive).toHaveCSS('grid-template-columns', '40px 40px');
  await expect(span).toHaveCSS('grid-column', 'span 2 / span 2');
  await expect(page.getByTestId('grid-array-span')).toHaveCSS('grid-column', 'span 1 / span 1');
  await expect(page.getByTestId('grid-row-span')).toHaveCSS('grid-row', 'span 2 / span 2');
  await expect(page.getByTestId('grid-lines')).toHaveCSS('grid-column-start', '2');
  await expect(page.getByTestId('grid-lines')).toHaveCSS('grid-column-end', '4');
  await expect(page.getByTestId('grid-lines')).toHaveCSS('grid-row-start', '2');
  await expect(page.getByTestId('grid-lines')).toHaveCSS('grid-row-end', '3');
  await expect(page.getByTestId('grid-css-override')).toHaveCSS(
    'grid-template-columns',
    '50px 50px',
  );
  await expect(page.getByTestId('grid-item-css-override')).toHaveCSS('grid-column', '1 / 2');
  await expect(page.getByTestId('grid-unstyled')).toHaveCSS('display', 'inline-grid');
  await expect(page.getByTestId('grid-item-unstyled')).toHaveCSS('grid-column', 'span 2 / span 2');

  const live = page.getByRole('button', { name: 'Change grid tracks' });
  const child = page.getByTestId('grid-reactive-child');
  await expect(live).toHaveAttribute('data-grid-ref', 'button');
  await expect(live).toHaveCSS('grid-template-columns', '40px');
  await child.evaluate(
    /** Mark the child before a reactive layout change. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await live.click();
  await expect(live).toHaveCSS('grid-template-columns', '40px 40px');
  await expect(child).toHaveAttribute('data-original-node', 'true');
  const liveItem = page.getByTestId('grid-item-reactive');
  await expect(liveItem).toHaveAttribute('data-item-ref', 'button');
  await expect(liveItem).toHaveCSS('grid-column', 'span 2 / span 2');
  await liveItem.focus();
  await expect(liveItem).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(liveItem).toHaveCSS('grid-column', 'span 1 / span 1');
  const link = page.getByRole('link', { name: 'Grid link' });
  await expect(link).toHaveCSS('grid-column', 'span 2 / span 2');
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#grid-target$/);

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(responsive).toHaveCSS('grid-template-columns', '40px 40px 40px');
  await expect(span).toHaveCSS('grid-column', 'span 3 / span 3');
  await expect(page.getByTestId('grid-array-span')).toHaveCSS('grid-column', 'span 2 / span 2');
  await page.addStyleTag({ content: '.lui-grid[data-testid="grid-basic"] { gap: 21px; }' });
  await expect(grid).toHaveCSS('gap', '21px');
}

/** Render the published Grid and GridItem without a runtime provider. */
function renderServerGrid(): JSX.Element {
  return createComponent(Grid, {
    id: 'server-grid',
    templateColumns: { base: '30px 30px', md: '30px 30px 30px' },
    /** Render the item through the published server export. */
    get children() {
      return createComponent(GridItem, {
        id: 'server-grid-item',
        colSpan: { base: 1, md: 2 },
        children: 'Server item',
      });
    },
  });
}

/** Verify published server styles resolve at both responsive widths. */
async function verifiesServerGrid({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerGrid);
  expect(markup).toContain('Server item');
  expect(markup).not.toMatch(/<(?:div|section)[^>]*\s(?:templateColumns|colSpan|css)=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setViewportSize({ width: 600, height: 700 });
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const grid = page.locator('#server-grid');
  const item = page.locator('#server-grid-item');
  await expect(grid).toHaveCSS('display', 'grid');
  await expect(grid).toHaveCSS('grid-template-columns', '30px 30px');
  await expect(item).toHaveCSS('grid-column', 'span 1 / span 1');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(grid).toHaveCSS('grid-template-columns', '30px 30px 30px');
  await expect(item).toHaveCSS('grid-column', 'span 2 / span 2');
}

test('Grid and GridItem preserve layout aliases and native behavior', verifiesGrid);
test('published Grid and GridItem render responsive server styles', verifiesServerGrid);
