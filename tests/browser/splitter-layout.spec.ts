import { expect, test, type Locator, type Page } from '@playwright/test';

/** Require a measurable panel box before checking layout. */
async function panelBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Splitter panel has no measurable box.');
  return box;
}

/** Accept browser subpixel rounding around the requested CSS size. */
function expectNear(actual: number, target: number): void {
  expect(Math.abs(actual - target)).toBeLessThan(2);
}

/** Verify changing orientation keeps nodes and reorients keyboard resizing. */
async function verifiesResponsiveOrientation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-responsive--orientation');
  const root = page.getByTestId('splitter-responsive-root');
  const panel = page.getByTestId('splitter-responsive-a');
  const trigger = page.getByTestId('splitter-responsive-trigger');
  await expect(trigger).toHaveAttribute('data-orientation', 'horizontal', { timeout: 30_000 });
  await expect(trigger).toHaveCSS('min-width', '8px');
  await expect(trigger.locator('.leverui-splitter__resizeTriggerIndicator')).toHaveCSS(
    'height',
    '24px',
  );
  const before = await panelBox(panel);
  await panel.evaluate(
    /** Mark the original panel before its orientation changes. */
    (element) => element.setAttribute('data-original-panel', 'true'),
  );
  await page.getByTestId('splitter-orientation-toggle').click();
  await expect(root).toHaveAttribute('data-orientation', 'vertical');
  await expect(trigger).toHaveAttribute('data-orientation', 'vertical');
  await expect(trigger).toHaveCSS('min-height', '8px');
  await expect(trigger.locator('.leverui-splitter__resizeTriggerIndicator')).toHaveCSS(
    'width',
    '24px',
  );
  await expect(panel).toHaveAttribute('data-original-panel', 'true');
  const vertical = await panelBox(panel);
  expect(vertical.height).toBeLessThan(before.height);
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  expect((await panelBox(panel)).height).toBeGreaterThan(vertical.height);
}

/** Verify CSS-unit sizes resolve against the rendered parent width. */
async function verifiesCssUnits({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-sizing--css-units');
  const nav = page.getByTestId('splitter-css-nav');
  const trigger = page.getByTestId('splitter-css-trigger');
  await expect(trigger).toHaveAttribute('role', 'separator', { timeout: 30_000 });
  expectNear((await panelBox(nav)).width, 180);
  await trigger.focus();
  await page.keyboard.press('Home');
  expectNear((await panelBox(nav)).width, 120);
  await page.keyboard.press('End');
  expectNear((await panelBox(nav)).width, 250);
}

/** Verify a fixed panel retains its pixel width as the group grows. */
async function verifiesPreservedPixels({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-sizing--preserve-pixels');
  const parent = page.getByTestId('splitter-resizable-parent');
  const panel = page.getByTestId('splitter-fixed-panel');
  const trigger = page.getByTestId('splitter-fixed-trigger');
  await expect(trigger).toHaveAttribute('role', 'separator', {
    timeout: 30_000,
  });
  await expect(parent).toHaveCSS('width', '500px');
  await expect(trigger).toHaveAttribute('aria-valuenow', '40');
  const initial = await panelBox(panel);
  expectNear(initial.width, 200);
  await page.getByTestId('splitter-grow-parent').click();
  await expect(parent).toHaveCSS('width', '600px');
  await expect(trigger).toHaveAttribute('aria-valuenow', '33');
  expectNear((await panelBox(panel)).width, initial.width);
}

test(
  'Splitter reacts to orientation changes without replacing panels',
  verifiesResponsiveOrientation,
);
test('Splitter resolves CSS-unit sizes and constraints', verifiesCssUnits);
test('Splitter preserves fixed panel pixels on parent resize', verifiesPreservedPixels);
