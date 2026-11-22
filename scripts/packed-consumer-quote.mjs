import assert from 'node:assert/strict';

/** Verify native semantics, installed types, CSS priority, and reactivity. */
export async function verifyPackedQuote(page) {
  const native = page.locator('#packed-native-quote');
  assert.equal(
    await native.evaluate(
      /** Read the installed component's native quotation tag. */
      (element) => element.tagName,
    ),
    'Q',
  );
  assert.equal(await native.getAttribute('cite'), 'https://example.com/packed');
  assert.equal(await native.getAttribute('data-packed-quote-ref'), 'q');
  assert.equal(
    await native.evaluate(
      /** Read the quotation's default weight from the consumer browser. */
      (element) => getComputedStyle(element).fontWeight,
    ),
    '700',
  );
  assert.equal(
    await page.locator('#packed-css-quote').evaluate(
      /** Confirm a consumer stylesheet outranks the library base layer. */
      (element) => getComputedStyle(element).fontWeight,
    ),
    '400',
  );

  const anchor = page.locator('#packed-link-quote');
  assert.equal(
    await anchor.evaluate(
      /** Read the tag selected by the installed component's as prop. */
      (element) => element.tagName,
    ),
    'A',
  );
  assert.equal(await anchor.getAttribute('href'), '#packed-quote-target');
  assert.equal(await anchor.getAttribute('data-packed-anchor-ref'), 'true');
  await anchor.click();
  assert.equal(await anchor.getAttribute('data-packed-anchor-clicked'), 'true');

  const reactive = page.locator('#packed-reactive-quote');
  await reactive.evaluate(
    /** Mark the original q before changing its style prop. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-quote-toggle').click();
  assert.equal(await reactive.getAttribute('data-original-node'), 'true');
  assert.equal(
    await reactive.evaluate(
      /** Read the weight after the consumer changes a tracked style prop. */
      (element) => getComputedStyle(element).fontWeight,
    ),
    '400',
  );
}
