import { expect, test, type Page } from '@playwright/test';

const layouts = [
  { id: 'basic', direction: 'column', align: 'normal', gap: '8px', count: 3 },
  { id: 'horizontal', direction: 'row', align: 'normal', gap: '8px', count: 3 },
  { id: 'h-stack', direction: 'row', align: 'center', gap: '8px', count: 3 },
  { id: 'v-stack', direction: 'column', align: 'center', gap: '8px', count: 3 },
  { id: 'separator', direction: 'column', align: 'normal', gap: 'normal', count: 5 },
  { id: 'responsive-direction', direction: 'row', align: 'normal', gap: '40px', count: 3 },
  { id: 'custom-separator', direction: 'column', align: 'normal', gap: 'normal', count: 5 },
  { id: 'responsive-separator', direction: 'row', align: 'normal', gap: 'normal', count: 5 },
] as const;

/** Check each Stack example's desktop flex layout. */
async function verifiesStackLayouts({ page }: { page: Page }): Promise<void> {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const layout of layouts) {
    await page.goto(`/iframe.html?id=layout-stack--${layout.id}`);
    const stack = page.locator('#storybook-root .lui-stack');
    await expect(stack).toBeVisible();
    await expect(stack.locator(':scope > :not(style)')).toHaveCount(layout.count);
    await expect(stack).toHaveCSS('display', 'flex');
    await expect(stack).toHaveCSS('flex-direction', layout.direction);
    await expect(stack).toHaveCSS('align-items', layout.align);
    await expect(stack).toHaveCSS('gap', layout.gap);
  }
  await page.goto('/iframe.html?id=layout-stack--custom-separator');
  await expect(page.locator('#storybook-root .lui-stack [role="separator"]').first()).toHaveCSS(
    'border-color',
    'rgb(239, 68, 68)',
  );
}

/** Preserve the direction and separator colors across breakpoints. */
async function verifiesResponsiveStack({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 400, height: 720 });
  await page.goto('/iframe.html?id=layout-stack--responsive-direction');
  await expect(page.locator('#storybook-root .lui-stack')).toHaveCSS('flex-direction', 'column');

  await page.goto('/iframe.html?id=layout-stack--responsive-separator');
  const stack = page.locator('#storybook-root .lui-stack');
  const separator = stack.locator('.lui-stack-separator').first();
  await expect(stack).toHaveCSS('flex-direction', 'column');
  await expect(separator).toHaveCSS('border-color', 'rgb(34, 197, 94)');

  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(stack).toHaveCSS('flex-direction', 'row');
  await expect(separator).toHaveCSS('border-color', 'rgb(254, 202, 202)');
}

test('all eight Stack examples match layouts', verifiesStackLayouts);
test('responsive Stack follows direction and colors', verifiesResponsiveStack);
