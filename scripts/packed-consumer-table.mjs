import assert from 'node:assert/strict';

/** Verify the installed table's semantics, styles, events, and live defaults. */
export async function verifyPackedTable(page) {
  const root = page.locator('#packed-table');
  const cell = page.locator('#packed-table-cell');
  assert.equal(await root.getAttribute('data-packed-table-ref'), 'table');
  assert.equal(await root.getAttribute('size'), null);
  assert.equal(await page.locator('#packed-table-column').getAttribute('width'), '60%');
  assert.equal(
    await page.locator('#packed-table-scroll').evaluate(
      /** Read the installed scroll container's overflow. */
      (element) => getComputedStyle(element).overflowX,
    ),
    'auto',
  );
  assert.equal(
    await cell.evaluate(
      /** Read the small variant's native cell padding. */
      (element) => getComputedStyle(element).paddingLeft,
    ),
    '8px',
  );
  await cell.evaluate(
    /** Mark the node before changing the root's inherited size. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-table-toggle').click();
  assert.equal(await cell.getAttribute('data-original-node'), 'true');
  assert.equal(
    await cell.evaluate(
      /** Read the large variant on the same native cell. */
      (element) => getComputedStyle(element).paddingLeft,
    ),
    '16px',
  );
  const rowAction = page.locator('#packed-table-row-action');
  await rowAction.click();
  assert.equal(await page.locator('#packed-table-clicks').textContent(), '1');
  await rowAction.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#packed-table-clicks').textContent(), '2');
  assert.equal(
    await page.locator('#packed-table-css-cell').evaluate(
      /** Read the consumer's CSS override after package styles. */
      (element) => getComputedStyle(element).color,
    ),
    'rgb(1, 2, 3)',
  );
  assert.equal(
    await page.locator('#packed-table-plain-cell').evaluate(
      /** Read native descendant styling without a Table.Cell component. */
      (element) => getComputedStyle(element).paddingLeft,
    ),
    '8px',
  );
  assert.equal(await page.locator('#packed-table-native').getAttribute('native'), null);
}
