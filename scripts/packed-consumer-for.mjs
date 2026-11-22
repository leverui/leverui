import assert from 'node:assert/strict';

/** Verify the installed list renders native items and its empty fallback. */
export async function verifyPackedFor(page) {
  const list = page.locator('#packed-for');
  await list.waitFor();
  assert.deepEqual(await list.locator(':scope > span').allTextContents(), [
    'One',
    'Two',
    'No items',
  ]);
  assert.deepEqual(
    await list.locator(':scope > span').first().getAttribute('data-packed-index'),
    '0',
  );
  assert.equal(await page.locator('#packed-for-fallback').count(), 1);
}
