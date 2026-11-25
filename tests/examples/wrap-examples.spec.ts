import { expect, test, type Page } from '@playwright/test';

const layouts = [
  { id: 'basic', count: 3, gap: '8px', align: 'normal', justify: 'normal' },
  { id: 'responsive', count: 11, gap: '24px', align: 'normal', justify: 'flex-start' },
  { id: 'align', count: 5, gap: '30px', align: 'center', justify: 'normal' },
  { id: 'gap', count: 10, gap: '20px', align: 'normal', justify: 'normal' },
  { id: 'justify', count: 5, gap: '30px', align: 'normal', justify: 'center' },
  { id: 'row-column-gap', count: 10, gap: '24px 12px', align: 'normal', justify: 'normal' },
] as const;

/** Check each Wrap story's desktop layout contract. */
async function verifiesWrapLayouts({ page }: { page: Page }): Promise<void> {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const layout of layouts) {
    await page.goto(`/iframe.html?id=layout-wrap--${layout.id}`);
    const wrap = page.locator('#storybook-root .lui-wrap');
    await expect(wrap).toBeVisible();
    await expect(wrap.locator(':scope > :not(style)')).toHaveCount(layout.count);
    await expect(wrap).toHaveCSS('display', 'flex');
    await expect(wrap).toHaveCSS('flex-wrap', 'wrap');
    await expect(wrap).toHaveCSS('gap', layout.gap);
    await expect(wrap).toHaveCSS('align-items', layout.align);
    await expect(wrap).toHaveCSS('justify-content', layout.justify);
  }
}

/** Keep the base and wider responsive spacing. */
async function verifiesResponsiveWrap({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 400, height: 720 });
  await page.goto('/iframe.html?id=layout-wrap--responsive');
  const wrap = page.locator('#storybook-root .lui-wrap');
  await expect(wrap).toHaveCSS('gap', '12px');
  await expect(wrap).toHaveCSS('justify-content', 'center');
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(wrap).toHaveCSS('gap', '24px');
  await expect(wrap).toHaveCSS('justify-content', 'flex-start');
}

test('all six Wrap examples match layouts', verifiesWrapLayouts);
test('responsive Wrap follows the breakpoints', verifiesResponsiveWrap);
