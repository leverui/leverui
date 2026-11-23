import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type {
  Grid as GridExport,
  GridItem as ItemExport,
  SimpleGrid as SimpleGridExport,
} from '../../src';

type ServerExports = {
  Grid: typeof GridExport;
  GridItem: typeof ItemExport;
  SimpleGrid: typeof SimpleGridExport;
};

const serverEntry = '../../dist/server/index.js';
const { Grid, GridItem, SimpleGrid } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render native Grid, item placement, and SimpleGrid without runtime styles. */
function renderPlainGrids(): JSX.Element {
  return [
    createComponent(Grid, {
      id: 'plain-server-grid',
      class: 'consumer-grid',
      templateColumns: { base: '40px 40px', md: '40px 40px 40px' },
      children: [
        createComponent(GridItem, {
          id: 'plain-server-item',
          colSpan: { base: 1, md: 2 },
          children: 'Placed item',
        }),
        createComponent(Grid, {
          id: 'nested-server-grid',
          children: 'Nested grid',
        }),
      ],
    }),
    createComponent(Grid, {
      id: 'unstyled-server-grid',
      unstyled: true,
      inline: true,
      children: 'Unstyled grid',
    }),
    createComponent(SimpleGrid, {
      id: 'plain-simple-grid',
      columns: { base: 2, md: 3 },
      style: { width: '300px' },
      children: 'Simple grid',
    }),
  ];
}

/** Verify script-free layout, responsive placement, and consumer overrides. */
async function verifiesGridCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderPlainGrids);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const grid = page.locator('#plain-server-grid');
  const item = page.locator('#plain-server-item');
  await expect(grid).toHaveCSS('display', 'grid');
  await expect(grid).toHaveCSS('grid-template-columns', '40px 40px');
  await expect(item).toHaveCSS('grid-column', 'span 1 / span 1');
  const nestedValue = await page.locator('#nested-server-grid').evaluate(
    /** Confirm the nested Grid resets its parent's private track selection. */
    (element) =>
      getComputedStyle(element).getPropertyValue('--lui-private-grid-template-columns-base'),
  );
  expect(nestedValue.trim()).toBe('');
  await expect(page.locator('#unstyled-server-grid')).toHaveCSS('display', 'inline-grid');
  await expect(page.locator('#plain-simple-grid')).toHaveCSS(
    'grid-template-columns',
    '150px 150px',
  );
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(grid).toHaveCSS('grid-template-columns', '40px 40px 40px');
  await expect(item).toHaveCSS('grid-column', 'span 2 / span 2');
  await expect(page.locator('#plain-simple-grid')).toHaveCSS(
    'grid-template-columns',
    '100px 100px 100px',
  );
  await page.addStyleTag({ content: '.consumer-grid { grid-template-columns: 50px 50px; }' });
  await expect(grid).toHaveCSS('grid-template-columns', '50px 50px');
}

test('Grid, GridItem, and SimpleGrid use authored CSS before hydration', verifiesGridCss);
