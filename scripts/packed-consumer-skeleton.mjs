import assert from 'node:assert/strict';

/** Verify installed placeholders, CSS overrides, and live content in Chromium. */
export async function verifyPackedSkeleton(page) {
  const skeleton = page.locator('#packed-skeleton');
  const text = page.locator('#packed-skeleton-text');
  const inherited = page.locator('#packed-skeleton-inherited');
  assert.equal(await skeleton.getAttribute('data-skeleton-ref'), 'div');
  assert.equal(await skeleton.locator('#packed-skeleton-content').count(), 1);
  assert.equal(await text.locator('.leverui-skeleton').count(), 3);
  assert.equal(await text.locator('[data-packed-text-child]').count(), 3);
  assert.equal(await page.locator('#packed-skeleton-circle').count(), 1);
  assert.equal(await page.locator('#packed-skeleton-owned').count(), 1);
  assert.equal(
    await skeleton.evaluate(
      /** Read a consumer stylesheet override through the stable class. */
      (element) => getComputedStyle(element).borderWidth,
    ),
    '3px',
  );
  assert.equal(
    await skeleton.evaluate(
      /** Read the public animation duration override. */
      (element) => getComputedStyle(element).animationDuration,
    ),
    '2s',
  );
  await skeleton.evaluate(
    /** Mark the installed native element before a Solid update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-skeleton-toggle').click();
  assert.equal(await skeleton.getAttribute('data-original-node'), 'true');
  assert.equal(await text.locator('.leverui-skeleton').count(), 1);
  assert.equal(await text.locator('[data-packed-text-child]').count(), 1);
  assert.equal(await text.textContent(), 'Finished text');
  assert.equal(
    await inherited.evaluate(
      /** Read inherited recipe styling after the provider update. */
      (element) => getComputedStyle(element).animationName,
    ),
    'bg-position',
  );
}
