import assert from 'node:assert/strict';

/** Verify installed Stat semantics, group sizing, and provider reactivity. */
export async function verifyPackedStat(page) {
  const root = page.locator('#packed-stat');
  assert.equal(
    await root.evaluate(
      /** Read the native description-list tag. */
      (element) => element.tagName,
    ),
    'DL',
  );
  assert.equal(await root.getAttribute('data-packed-stat-ref'), 'dl');
  assert.equal(await page.locator('#packed-stat-up').getAttribute('data-type'), 'up');
  assert.equal(await page.locator('#packed-stat-up svg path').count(), 2);

  const group = page.locator('#packed-stat-group');
  assert.equal(await group.getAttribute('role'), 'group');
  const groupSize = await page.locator('#packed-stat-group-value').evaluate(
    /** Read the size inherited from the surrounding Stat group. */
    (element) => getComputedStyle(element).fontSize,
  );
  const defaultSize = await page.locator('#packed-stat-value').evaluate(
    /** Read the independent default size for comparison. */
    (element) => getComputedStyle(element).fontSize,
  );
  assert.notEqual(groupSize, defaultSize);

  const reactive = page.locator('#packed-reactive-stat-value');
  await reactive.evaluate(
    /** Mark the current value node before changing provider size. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-stat-toggle').click();
  assert.equal(await reactive.getAttribute('data-original-node'), 'true');
  assert.equal(
    await reactive.evaluate(
      /** Read the large size after the provider update. */
      (element) => getComputedStyle(element).fontSize,
    ),
    groupSize,
  );
}
