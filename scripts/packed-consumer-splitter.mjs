import assert from 'node:assert/strict';

/** Verify the installed Splitter responds to keyboard input in Chromium. */
export async function verifyPackedSplitter(page) {
  const trigger = page.getByTestId('packed-splitter-trigger');
  const first = page.getByTestId('packed-splitter-a');
  const second = page.getByTestId('packed-splitter-b');
  await trigger.waitFor({ state: 'visible' });
  assert.equal(await trigger.getAttribute('role'), 'separator');
  assert.equal(await trigger.getAttribute('aria-label'), 'Resize');
  assert.equal(await trigger.getAttribute('aria-valuenow'), '40');
  const before = await first.boundingBox();
  await trigger.focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await trigger.getAttribute('aria-valuenow'), '41');
  assert.equal(await page.locator('#packed-splitter-size').textContent(), '41');
  const after = await first.boundingBox();
  assert.ok(before && after && after.width > before.width);
  assert.ok(await second.isVisible());
}
