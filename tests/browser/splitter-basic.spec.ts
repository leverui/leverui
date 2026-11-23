import { expect, test, type Page } from '@playwright/test';

/** Verify primitive-owned resize behavior and Lever UI's native handle styles. */
async function verifiesBasicSplitter({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter--basic');
  const root = page.getByTestId('splitter-root');
  const first = page.getByTestId('splitter-panel-a');
  const second = page.getByTestId('splitter-panel-b');
  const trigger = page.getByTestId('splitter-trigger');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-splitter-root');
  await expect(root).toHaveCSS('display', 'flex');
  await expect(trigger).toHaveAttribute('aria-label', 'Resize');
  await expect(trigger).toHaveAttribute('role', 'separator');
  await expect(trigger).toHaveClass(/lui-splitter__resizeTrigger/);
  await expect(trigger.locator('.lui-splitter__resizeTriggerSeparator')).toHaveCount(1);
  const indicator = trigger.locator('.lui-splitter__resizeTriggerIndicator');
  await expect(indicator).toHaveCount(1);
  const baseColor = await indicator.evaluate(
    /** Read the default handle color before focus and dragging. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  const initialFirst = await first.boundingBox();
  const initialSecond = await second.boundingBox();
  expect(initialFirst && initialSecond).toBeTruthy();
  if (!initialFirst || !initialSecond) throw new Error('Splitter panels have no layout boxes.');
  expect(initialFirst.width).toBeLessThan(initialSecond.width);

  await trigger.focus();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('data-focus', '');
  const focusColor = await indicator.evaluate(
    /** Read the focused handle's computed recipe color. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(focusColor).not.toBe(baseColor);
  await page.keyboard.press('ArrowRight');
  const afterKey = await first.boundingBox();
  expect(afterKey && afterKey.width).toBeGreaterThan(initialFirst.width);
  await expect(page.getByTestId('splitter-resize-count')).not.toHaveText('0');

  const beforeDrag = await first.boundingBox();
  const triggerBox = await trigger.boundingBox();
  if (!beforeDrag || !triggerBox) throw new Error('Splitter drag boxes are absent.');
  await page.mouse.move(triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height / 2);
  await page.mouse.down();
  await expect(trigger).toHaveAttribute('data-dragging', '');
  const dragColor = await indicator.evaluate(
    /** Read the dragging handle's computed recipe color. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(dragColor).not.toBe(focusColor);
  await page.mouse.move(triggerBox.x + 35, triggerBox.y + triggerBox.height / 2, { steps: 5 });
  await page.mouse.up();
  const afterDrag = await first.boundingBox();
  expect(afterDrag && afterDrag.width).toBeGreaterThan(beforeDrag.width);
  await expect(page.getByTestId('splitter-end-count')).not.toHaveText('0');
}

test('Splitter resizes by keyboard and pointer with styled native parts', verifiesBasicSplitter);
