import { expect, test, type Page } from '@playwright/test';

const layouts = [
  { id: 'basic', items: 3, columns: 3, gap: '24px' },
  { id: 'spanning-columns', items: 4, columns: 5, gap: '16px' },
  { id: 'col-span', items: 3, columns: 4, gap: '24px' },
  { id: 'template-areas', items: 5, columns: 4, gap: '16px' },
] as const;

/** Read the number of browser-resolved grid tracks. */
async function countTracks(page: Page): Promise<number> {
  return page.locator('#storybook-root .lui-grid').evaluate(
    /** Count each computed CSS grid column. */
    (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length,
  );
}

/** Check the four Grid examples at their desktop viewport. */
async function verifiesGridLayouts({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const layout of layouts) {
    await page.goto(`/iframe.html?id=layout-grid--${layout.id}`);
    const grid = page.locator('#storybook-root .lui-grid');
    await expect(grid).toBeVisible();
    await expect(grid.locator(':scope > :not(style)')).toHaveCount(layout.items);
    await expect(grid).toHaveCSS('display', 'grid');
    await expect(grid).toHaveCSS('gap', layout.gap);
    expect(await countTracks(page)).toBe(layout.columns);
  }
}

/** Preserve the row and column spans and named colored areas. */
async function verifiesGridSpansAndAreas({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/iframe.html?id=layout-grid--spanning-columns');
  const spanning = page.locator('#storybook-root .lui-grid > :not(style)');
  await expect(spanning.first()).toHaveCSS('grid-row', 'span 2 / span 2');
  await expect(spanning.last()).toHaveCSS('grid-column', 'span 4 / span 4');

  await page.goto('/iframe.html?id=layout-grid--template-areas');
  const areas = page.locator('#storybook-root .lui-grid');
  await expect(areas).toHaveCSS(
    'grid-template-areas',
    '"one one two three" "four five five three"',
  );
  const named = areas.locator(':scope > :not(style)');
  await expect(named.nth(0)).toHaveCSS('background-color', 'rgb(34, 197, 94)');
  await expect(named.nth(2)).toHaveCSS('grid-area', 'three');
  await expect(named.nth(4)).toHaveCSS('background-color', 'rgb(234, 179, 8)');
}

test('all four Grid examples match layouts', verifiesGridLayouts);
test('Grid spans and template areas lay out correctly', verifiesGridSpansAndAreas);
