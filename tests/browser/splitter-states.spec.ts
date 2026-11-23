import { expect, test, type Page } from '@playwright/test';

/** Verify controlled sizes follow the primitive's keyboard resize events. */
async function verifiesControlledSize({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-states--controlled');
  const size = page.getByTestId('splitter-controlled-size');
  const trigger = page.getByTestId('splitter-controlled-trigger');
  await expect(size).toHaveText('35', { timeout: 30_000 });
  await trigger.focus();
  await page.keyboard.press('ArrowRight');
  await expect(size).not.toHaveText('35');
  const first = page.getByTestId('splitter-controlled-a');
  await expect(first).toHaveAttribute('data-splitter-panel');
  expect(Number(await size.textContent())).toBeGreaterThan(35);
}

/** Verify a RootProvider receives its external machine and context reset. */
async function verifiesExternalStore({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-states--external-store');
  const size = page.getByTestId('splitter-store-size');
  await expect(size).toHaveText('45', { timeout: 30_000 });
  await page.getByTestId('splitter-store-set').click();
  await expect(size).toHaveText('25');
  await page.getByTestId('splitter-store-reset').click();
  await expect(size).toHaveText('45');
  await expect(page.getByTestId('splitter-store-trigger')).toHaveAttribute('role', 'separator');
}

/** Verify vertical panels resize along their block axis. */
async function verifiesVerticalResize({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-states--vertical');
  const first = page.getByTestId('splitter-vertical-a');
  const trigger = page.getByTestId('splitter-vertical-trigger');
  await expect(trigger).toHaveAttribute('data-orientation', 'vertical', { timeout: 30_000 });
  await expect(trigger).toHaveAttribute('aria-label', 'Resize vertically');
  const initial = await first.boundingBox();
  if (!initial) throw new Error('Vertical Splitter panel has no box.');
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const resized = await first.boundingBox();
  expect(resized && resized.height).toBeGreaterThan(initial.height);
}

/** Verify a disabled trigger does not change panel size. */
async function verifiesDisabledResize({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-states--disabled');
  const first = page.getByTestId('splitter-disabled-a');
  const trigger = page.getByTestId('splitter-disabled-trigger');
  await expect(trigger).toHaveAttribute('data-disabled', '', { timeout: 30_000 });
  await expect(trigger.locator('.lui-splitter__resizeTriggerIndicator')).toHaveCSS(
    'visibility',
    'hidden',
  );
  const initial = await first.boundingBox();
  if (!initial) throw new Error('Disabled Splitter panel has no box.');
  await trigger.focus();
  await page.keyboard.press('ArrowRight');
  const afterKey = await first.boundingBox();
  expect(afterKey && Math.abs(afterKey.width - initial.width)).toBeLessThan(1);
}

test('controlled Splitter updates its size prop', verifiesControlledSize);
test('Splitter RootProvider exposes external store and context', verifiesExternalStore);
test('vertical Splitter follows block-axis keyboard resizing', verifiesVerticalResize);
test('disabled Splitter trigger prevents resizing', verifiesDisabledResize);
