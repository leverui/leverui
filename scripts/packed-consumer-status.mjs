import assert from 'node:assert/strict';

/** Verify installed Status parts, palette, and provider reactivity. */
export async function verifyPackedStatus(page) {
  const root = page.locator('#packed-status');
  assert.equal(
    await root.evaluate(
      /** Read the native root tag. */
      (element) => element.tagName,
    ),
    'DIV',
  );
  assert.equal(await root.getAttribute('data-packed-status-ref'), 'div');
  assert.equal(await page.locator('#packed-status-indicator').count(), 1);

  const reactive = page.locator('#packed-reactive-status');
  const indicator = page.locator('#packed-reactive-status-indicator');
  const initialSize = await reactive.evaluate(
    /** Read the small font size before the provider changes. */
    (element) => getComputedStyle(element).fontSize,
  );
  const initialColor = await indicator.evaluate(
    /** Read the red indicator color before the provider changes. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await reactive.evaluate(
    /** Mark the current root before its provider updates. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-status-toggle').click();
  assert.equal(await reactive.getAttribute('data-original-node'), 'true');
  assert.notEqual(
    await reactive.evaluate(
      /** Read the large font size after the provider update. */
      (element) => getComputedStyle(element).fontSize,
    ),
    initialSize,
  );
  assert.notEqual(
    await indicator.evaluate(
      /** Read the green indicator color after the provider update. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
    initialColor,
  );
}
