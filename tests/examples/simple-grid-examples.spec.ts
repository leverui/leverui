import { expect, test, type Page } from '@playwright/test';

const layouts = [
  { id: 'basic', count: 4, columns: 2, rowGap: '40px', columnGap: '40px' },
  { id: 'auto-fit', count: 5, columns: 2, rowGap: '40px', columnGap: '40px' },
  { id: 'col-span', count: 2, columns: 4, rowGap: '40px', columnGap: '40px' },
  { id: 'columns', count: 5, columns: 3, rowGap: '40px', columnGap: '40px' },
  { id: 'row-col-gap', count: 4, columns: 2, rowGap: '16px', columnGap: '8px' },
] as const;

/** Count the browser-resolved grid tracks. */
async function countTracks(page: Page): Promise<number> {
  return page.locator('#storybook-root .lui-simple-grid').evaluate(
    /** Count each rendered CSS grid column. */
    (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length,
  );
}

/** Verify every SimpleGrid example against the desktop geometry. */
async function verifiesSimpleGridLayouts({ page }: { page: Page }): Promise<void> {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const layout of layouts) {
    await page.goto(`/iframe.html?id=layout-simplegrid--${layout.id}`);
    const grid = page.locator('#storybook-root .lui-simple-grid');
    await expect(grid).toBeVisible();
    await expect(grid.locator(':scope > :not(style)')).toHaveCount(layout.count);
    await expect(grid).toHaveCSS('display', 'grid');
    await expect(grid).toHaveCSS('row-gap', layout.rowGap);
    await expect(grid).toHaveCSS('column-gap', layout.columnGap);
    expect(await countTracks(page)).toBe(layout.columns);
  }
}

/** Preserve the responsive columns, gap, and item span. */
async function verifiesResponsiveSimpleGrid({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 400, height: 720 });
  await page.goto('/iframe.html?id=layout-simplegrid--columns');
  expect(await countTracks(page)).toBe(2);

  await page.goto('/iframe.html?id=layout-simplegrid--col-span');
  const grid = page.locator('#storybook-root .lui-simple-grid');
  await expect(grid).toHaveCSS('gap', '24px');
  expect(await countTracks(page)).toBe(2);
  await expect(grid.locator(':scope > :not(style)').first()).toHaveCSS(
    'grid-column',
    'span 1 / span 1',
  );

  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(grid).toHaveCSS('gap', '40px');
  expect(await countTracks(page)).toBe(4);
  await expect(grid.locator(':scope > :not(style)').first()).toHaveCSS(
    'grid-column',
    'span 3 / span 3',
  );
}

test('all five SimpleGrid examples match layouts', verifiesSimpleGridLayouts);
test('responsive SimpleGrid follows breakpoints', verifiesResponsiveSimpleGrid);
