import { expect, test, type Page } from '@playwright/test';

/** Verify both handles enforce their adjacent panel constraints. */
async function verifiesMultiPanel({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-advanced--multi-panel');
  const first = page.getByTestId('splitter-multi-first');
  const second = page.getByTestId('splitter-multi-second');
  await expect(first).toHaveAttribute('role', 'separator', { timeout: 30_000 });
  await expect(second).toHaveAttribute('role', 'separator');
  await expect(first).toHaveAttribute('aria-valuemin', '20');
  await expect(first).toHaveAttribute('aria-valuemax', '40');
  await first.focus();
  await page.keyboard.press('End');
  await expect(first).toHaveAttribute('aria-valuenow', '40');
  await page.keyboard.press('Home');
  await expect(first).toHaveAttribute('aria-valuenow', '20');
  const secondBefore = await second.getAttribute('aria-valuenow');
  await second.focus();
  await page.keyboard.press('ArrowLeft');
  expect(await second.getAttribute('aria-valuenow')).not.toBe(secondBefore);
}

/** Verify collapse and expansion events follow configured panel sizes. */
async function verifiesCollapse({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-advanced--collapsible');
  const panel = page.getByTestId('splitter-collapse-a');
  const trigger = page.getByTestId('splitter-collapse-trigger');
  await expect(trigger).toHaveAttribute('aria-valuenow', '40', { timeout: 30_000 });
  await trigger.focus();
  await page.keyboard.press('ArrowRight');
  await expect(trigger).toHaveAttribute('aria-valuenow', '41');
  await page.getByTestId('splitter-collapse-action').click();
  await expect(trigger).toHaveAttribute('aria-valuenow', '5');
  await expect(page.getByTestId('splitter-collapse-count')).toHaveText('1');
  const collapsed = await panel.boundingBox();
  expect(collapsed && collapsed.width).toBeLessThan(25);
  await page.getByTestId('splitter-expand-action').click();
  await expect(trigger).toHaveAttribute('aria-valuenow', '41');
  await expect(page.getByTestId('splitter-expand-count')).toHaveText('1');
}

/** Verify nested horizontal and vertical machines resize independently. */
async function verifiesNested({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-advanced--nested');
  const outer = page.getByTestId('splitter-nested-outer');
  const inner = page.getByTestId('splitter-nested-inner');
  const left = page.getByTestId('splitter-nested-left');
  const top = page.getByTestId('splitter-nested-top');
  await expect(outer).toHaveAttribute('data-orientation', 'horizontal', { timeout: 30_000 });
  await expect(inner).toHaveAttribute('data-orientation', 'vertical');
  const beforeLeft = await left.boundingBox();
  const beforeTop = await top.boundingBox();
  if (!beforeLeft || !beforeTop) throw new Error('Nested Splitter panels have no boxes.');
  await inner.focus();
  await page.keyboard.press('ArrowDown');
  const afterInnerLeft = await left.boundingBox();
  const afterInnerTop = await top.boundingBox();
  expect(afterInnerTop && afterInnerTop.height).toBeGreaterThan(beforeTop.height);
  expect(afterInnerLeft && Math.abs(afterInnerLeft.width - beforeLeft.width)).toBeLessThan(1);
  await outer.focus();
  await page.keyboard.press('ArrowRight');
  const afterOuterLeft = await left.boundingBox();
  expect(afterOuterLeft && afterOuterLeft.width).toBeGreaterThan(beforeLeft.width);
}

test('multi-panel Splitter honors minimum and maximum sizes', verifiesMultiPanel);
test('collapsible Splitter emits collapse and expand states', verifiesCollapse);
test('nested Splitters resize independent axes', verifiesNested);
