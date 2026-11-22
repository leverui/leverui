import assert from 'node:assert/strict';

/** Verify installed SimpleGrid tracks and live child identity in Chromium. */
export async function verifyPackedSimpleGrid(page) {
  const grid = page.locator('#packed-simple-grid');
  const auto = page.locator('#packed-simple-grid-auto');
  const child = page.locator('#packed-simple-grid-child');
  await grid.waitFor({ state: 'visible' });
  assert.equal(await grid.getAttribute('columns'), null);
  assert.equal(await grid.getAttribute('minChildWidth'), null);
  assert.equal(
    await grid.evaluate(
      /** Read installed count-based tracks. */
      (element) => getComputedStyle(element).gridTemplateColumns,
    ),
    '120px 120px',
  );
  assert.equal(
    await auto.evaluate(
      /** Read installed size-token auto-fit tracks. */
      (element) => getComputedStyle(element).gridTemplateColumns,
    ),
    '100px 100px 100px',
  );
  await child.evaluate(
    /** Mark the existing native child before the Solid update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-simple-grid-toggle').click();
  assert.equal(
    await grid.evaluate(
      /** Read the updated tracks from the installed package. */
      (element) => getComputedStyle(element).gridTemplateColumns,
    ),
    '80px 80px 80px',
  );
  assert.equal(await child.getAttribute('data-original-node'), 'true');
}
