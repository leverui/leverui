import { expect, test, type Page } from '@playwright/test';

/** Verify a minimal handle preserves keyboard and pointer behavior. */
async function verifiesHandle({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=layout-splitter-handle--separator-only');
  const trigger = page.getByTestId('splitter-handle-trigger');
  const separator = page.getByTestId('splitter-handle-separator');
  await expect(trigger).toHaveAttribute('aria-valuenow', '40', { timeout: 30_000 });
  await expect(separator).toHaveCount(1);
  await expect(trigger.locator('.lui-splitter__resizeTriggerIndicator')).toHaveCount(0);
  await expect(separator).toHaveCSS('width', '1px');
  await trigger.focus();
  await page.keyboard.press('ArrowRight');
  await expect(trigger).toHaveAttribute('aria-valuenow', '45');
  await page.keyboard.press('Shift+ArrowRight');
  await expect(trigger).toHaveAttribute('aria-valuenow', '55');
  expect(Number(await page.getByTestId('splitter-handle-starts').textContent())).toBeGreaterThan(0);
  await trigger.dblclick();
  await expect(trigger).toHaveAttribute('aria-valuenow', '40');

  const startsBeforePointer = Number(
    await page.getByTestId('splitter-handle-starts').textContent(),
  );
  const box = await trigger.boundingBox();
  if (!box) throw new Error('Splitter handle has no pointer target.');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(page.getByTestId('splitter-handle-starts')).toHaveText(
    String(startsBeforePointer + 1),
  );
  await page.mouse.move(box.x + 30, box.y + box.height / 2, { steps: 4 });
  await page.mouse.up();
  await expect(page.getByTestId('splitter-handle-ends')).not.toHaveText('0');
  await expect(trigger).not.toHaveAttribute('aria-valuenow', '40');
}

test('separator-only Splitter supports reset, keyboard steps, and resize events', verifiesHandle);
