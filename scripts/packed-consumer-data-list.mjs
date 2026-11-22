import assert from 'node:assert/strict';

/** Verify installed Data List semantics, styling, and reactive orientation. */
export async function verifyPackedDataList(page) {
  const list = page.locator('#packed-data-list');
  const item = page.locator('#packed-data-list-item');
  assert.equal(
    await list.evaluate(
      /** Read the published native list element. */
      (element) => element.tagName,
    ),
    'DL',
  );
  assert.equal(
    await page.locator('#packed-data-list-label').evaluate(
      /** Read the published native term element. */
      (element) => element.tagName,
    ),
    'DT',
  );
  assert.equal(
    await page.locator('#packed-data-list-value').evaluate(
      /** Read the published native description element. */
      (element) => element.tagName,
    ),
    'DD',
  );
  assert.equal(
    await item.evaluate(
      /** Read the initial inherited orientation. */
      (element) => getComputedStyle(element).flexDirection,
    ),
    'column',
  );
  await page.locator('#packed-data-list-toggle').click();
  assert.equal(
    await item.evaluate(
      /** Read the updated inherited orientation. */
      (element) => getComputedStyle(element).flexDirection,
    ),
    'row',
  );
  assert.equal(await page.locator('#packed-data-list-value').textContent(), 'Active');
}
