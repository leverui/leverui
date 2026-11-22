import assert from 'node:assert/strict';

/** Verify installed Strong markup, base style, CSS, and live updates. */
export async function verifyPackedStrong(page) {
  const native = page.locator('#packed-native-strong');
  assert.equal(
    await native.evaluate(
      /** Read the installed component's semantic tag. */
      (element) => element.tagName,
    ),
    'STRONG',
  );
  assert.equal(await native.getAttribute('data-packed-strong-ref'), 'strong');
  assert.equal(
    await native.evaluate(
      /** Read the base weight inside the isolated consumer. */
      (element) => getComputedStyle(element).fontWeight,
    ),
    '600',
  );
  assert.equal(
    await page.locator('#packed-css-strong').evaluate(
      /** Read the consumer stylesheet's final weight. */
      (element) => getComputedStyle(element).fontWeight,
    ),
    '300',
  );

  const selected = page.locator('#packed-link-strong');
  assert.equal(await selected.getAttribute('href'), '#packed-strong-target');
  assert.equal(await selected.getAttribute('data-packed-strong-ref'), 'a');

  const reactive = page.locator('#packed-reactive-strong');
  await reactive.evaluate(
    /** Mark the original element before changing its weight. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-strong-toggle').click();
  assert.equal(await reactive.getAttribute('data-original-node'), 'true');
  assert.equal(
    await reactive.evaluate(
      /** Read the consumer weight after the signal update. */
      (element) => getComputedStyle(element).fontWeight,
    ),
    '400',
  );
}
