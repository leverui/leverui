import { expect, test, type Page } from '@playwright/test';

const layouts = [
  { id: 'basic', direction: 'row', align: 'normal', gap: '16px', count: 3 },
  { id: 'align', direction: 'row', align: 'center', gap: '16px', count: 3 },
  { id: 'auto-margin', direction: 'row', align: 'normal', gap: '16px', count: 3 },
  { id: 'direction', direction: 'column', align: 'normal', gap: '16px', count: 3 },
  { id: 'justify', direction: 'column', align: 'normal', gap: '32px', count: 4 },
  { id: 'order', direction: 'row', align: 'normal', gap: '16px', count: 3 },
  { id: 'spacer', direction: 'row', align: 'normal', gap: 'normal', count: 3 },
  { id: 'wrap', direction: 'row', align: 'normal', gap: '16px', count: 3 },
] as const;

/** Check each Flex example's root layout. */
async function verifiesFlexLayouts({ page }: { page: Page }): Promise<void> {
  test.setTimeout(180_000);
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const layout of layouts) {
    await page.goto(`/iframe.html?id=layout-flex--${layout.id}`);
    const flex = page.locator('#storybook-root > div > .lui-flex');
    await expect(flex).toBeVisible();
    await expect(flex.locator(':scope > :not(style)')).toHaveCount(layout.count);
    await expect(flex).toHaveCSS('display', 'flex');
    await expect(flex).toHaveCSS('flex-direction', layout.direction);
    await expect(flex).toHaveCSS('align-items', layout.align);
    await expect(flex).toHaveCSS('gap', layout.gap);
  }
}

/** Preserve the ordered, wrapped, justified, and spaced variants. */
async function verifiesFlexVariants({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/iframe.html?id=layout-flex--auto-margin');
  await expect(page.locator('#storybook-root > div > .lui-flex')).toHaveCSS(
    'justify-content',
    'space-between',
  );

  await page.goto('/iframe.html?id=layout-flex--justify');
  const rows = page.locator('#storybook-root > div > .lui-flex > .lui-flex');
  await expect(rows).toHaveCount(4);
  for (const [index, value] of ['flex-start', 'center', 'flex-end', 'space-between'].entries()) {
    await expect(rows.nth(index)).toHaveCSS('justify-content', value);
  }

  await page.goto('/iframe.html?id=layout-flex--order');
  const ordered = page.locator('#storybook-root > div > .lui-flex > :not(style)');
  await expect(ordered.nth(1)).toHaveCSS('order', '3');
  await expect(ordered.nth(2)).toHaveCSS('order', '2');

  await page.goto('/iframe.html?id=layout-flex--wrap');
  const wrapped = page.locator('#storybook-root > div > .lui-flex');
  await expect(wrapped).toHaveCSS('flex-wrap', 'wrap');
  await expect(wrapped).toHaveCSS('width', '500px');

  await page.goto('/iframe.html?id=layout-flex--spacer');
  const boxes = page.locator('#storybook-root .flex-example-box');
  await expect(boxes).toHaveCount(2);
  await expect(boxes.first()).toHaveCSS('background-color', 'rgb(248, 113, 113)');
  await expect(boxes.last()).toHaveCSS('background-color', 'rgb(74, 222, 128)');
  await expect(boxes.first()).toHaveCSS('padding', '16px');
  await expect(boxes.first()).not.toHaveAttribute('style');
}

test('all eight Flex examples match layouts', verifiesFlexLayouts);
test('Flex variants preserve arrangement', verifiesFlexVariants);
