import assert from 'node:assert/strict';

/** Verify installed Grid geometry and a reactive item span in Chromium. */
export async function verifyPackedGrid(page) {
  const grid = page.locator('#packed-grid');
  const item = page.locator('#packed-grid-item');
  const child = page.locator('#packed-grid-child');
  await grid.waitFor({ state: 'visible' });
  assert.equal(
    await grid.evaluate(
      /** Read the installed container display value. */
      (element) => getComputedStyle(element).display,
    ),
    'grid',
  );
  assert.equal(
    await grid.evaluate(
      /** Read the initial installed track sizes. */
      (element) => getComputedStyle(element).gridTemplateColumns,
    ),
    '40px 40px',
  );
  assert.equal(await item.getAttribute('data-grid-item-ref'), 'button');
  assert.equal(await item.getAttribute('colSpan'), null);
  await child.evaluate(
    /** Mark the mounted item child before updating the grid. */
    (element) => {
      element.dataset.originalNode = 'true';
    },
  );
  await item.click();
  assert.equal(
    await grid.evaluate(
      /** Read the updated installed track sizes. */
      (element) => getComputedStyle(element).gridTemplateColumns,
    ),
    '40px 40px 40px',
  );
  assert.equal(
    await item.evaluate(
      /** Read the updated item track span. */
      (element) => getComputedStyle(element).gridColumn,
    ),
    'span 2 / span 2',
  );
  assert.equal(await child.getAttribute('data-original-node'), 'true');
}
