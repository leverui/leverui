import { expect, test, type Locator, type Page } from '@playwright/test';

/** Require an element box before comparing rendered spacing. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected Stack box is absent.');
  return box;
}

/** Compare Stack geometry with subpixel tolerance. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Verify Stack defaults, fixed wrappers, responsive separators, and native APIs. */
async function verifiesStackLayout({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-stack--contract');
  const basic = page.getByTestId('stack-basic');
  await expect(basic).toBeVisible({ timeout: 30_000 });
  await expect(basic).toHaveClass(/lui-stack/);
  await expect(basic).toHaveCSS('display', 'flex');
  await expect(basic).toHaveCSS('flex-direction', 'column');
  await expect(basic).toHaveCSS('gap', '8px');
  await expect(page.getByTestId('stack-basic-one')).toHaveClass('lui-box stack-story-item');
  await expect(page.getByTestId('stack-basic-one')).toHaveCSS('width', '20px');
  await expect(page.getByTestId('stack-basic-one')).toHaveCSS('height', '20px');
  const first = await requiredBox(page.getByTestId('stack-basic-one'));
  const second = await requiredBox(page.getByTestId('stack-basic-two'));
  expectNear(second.y - first.y - first.height, 8);

  await expect(page.getByTestId('stack-horizontal')).toHaveCSS('flex-direction', 'row');
  await expect(page.getByTestId('stack-horizontal')).toHaveCSS('align-items', 'center');
  await expect(page.getByTestId('stack-vertical')).toHaveCSS('flex-direction', 'column');
  await expect(page.getByTestId('stack-vertical')).toHaveCSS('align-items', 'flex-end');

  const responsive = page.getByTestId('stack-responsive');
  const lines = responsive.locator('.lui-stack-separator');
  await expect(lines).toHaveCount(2);
  await expect(responsive).toHaveCSS('flex-direction', 'column');
  await expect(responsive).toHaveCSS('gap', 'normal');
  await expect(lines.first()).toHaveCSS('margin-top', '8px');
  await expect(lines.first()).toHaveCSS('border-top-width', '1px');
  await expect(lines.first()).toHaveCSS('border-inline-start-width', '0px');
  await expect(page.getByTestId('stack-custom-line')).toHaveCSS('border-color', 'rgb(239, 68, 68)');
  const nativeLine = page.getByTestId('stack-native-line');
  await expect(nativeLine).toHaveClass(/lui-stack-separator/);
  await expect(nativeLine).toHaveCSS('margin-top', '8px');
  await expect(nativeLine).toHaveCSS('border-top-width', '1px');

  const nav = page.getByRole('navigation', { name: 'Stack navigation' });
  await expect(nav).toHaveAttribute('data-ref-tag', 'nav');
  const link = page.getByRole('link', { name: 'Stack link' });
  await expect(link).toHaveCSS('display', 'flex');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#stack-target$/);

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(responsive).toHaveCSS('flex-direction', 'row');
  await expect(lines.first()).toHaveCSS('margin-left', '8px');
  await expect(lines.first()).toHaveCSS('border-top-width', '0px');
  await expect(lines.first()).toHaveCSS('border-inline-start-width', '1px');
  await expect(nativeLine).toHaveCSS('margin-left', '8px');
  await expect(nativeLine).toHaveCSS('border-inline-start-width', '1px');
}

/** Verify live direction and item changes preserve mounted Stack children. */
async function verifiesReactiveStack({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-stack--contract');
  const stack = page.getByTestId('stack-reactive');
  const first = page.getByTestId('stack-reactive-one');
  const second = page.getByTestId('stack-reactive-two');
  const lines = stack.locator('.lui-stack-separator');
  await expect(lines).toHaveCount(1, { timeout: 30_000 });
  await expect(stack).toHaveCSS('flex-direction', 'column');
  await first.evaluate(
    /** Mark the first item before layout and list updates. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await second.evaluate(
    /** Mark the second item before layout and list updates. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await page.getByTestId('stack-toggle-direction').click();
  await expect(stack).toHaveCSS('flex-direction', 'row');
  await expect(lines.first()).toHaveCSS('margin-left', '16px');
  await expect(lines.first()).toHaveCSS('border-inline-start-width', '1px');
  await expect(first).toHaveAttribute('data-original-node', 'true');
  await expect(second).toHaveAttribute('data-original-node', 'true');

  await page.getByTestId('stack-toggle-extra').click();
  await expect(page.getByTestId('stack-reactive-extra')).toBeVisible();
  await expect(lines).toHaveCount(2);
  await expect(first).toHaveAttribute('data-original-node', 'true');
  await expect(second).toHaveAttribute('data-original-node', 'true');
  await page.getByTestId('stack-toggle-extra').click();
  await expect(lines).toHaveCount(1);
  await expect(second).toHaveAttribute('data-original-node', 'true');
}

test('Stack preserves layout, separators, wrappers, and native behavior', verifiesStackLayout);
test('Stack updates direction and children without replacing mounted items', verifiesReactiveStack);
