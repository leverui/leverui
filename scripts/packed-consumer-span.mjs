import assert from 'node:assert/strict';

/** Verify installed native spans, CSS precedence, and reactive updates. */
export async function verifyPackedSpan(page) {
  const native = page.locator('#packed-native-span');
  assert.equal(
    await native.evaluate(
      /** Read the installed component's native tag. */
      (element) => element.tagName,
    ),
    'SPAN',
  );
  assert.equal(await native.getAttribute('data-packed-span-ref'), 'span');
  assert.equal(
    await native.evaluate(
      /** Confirm the component retains inline layout in a paragraph. */
      (element) => getComputedStyle(element).display,
    ),
    'inline',
  );
  assert.equal(
    await page.locator('#packed-css-span').evaluate(
      /** Read the consumer stylesheet's override. */
      (element) => getComputedStyle(element).color,
    ),
    'rgb(1, 2, 3)',
  );

  const anchor = page.locator('#packed-link-span');
  assert.equal(await anchor.getAttribute('href'), '#packed-span-target');
  assert.equal(await anchor.getAttribute('data-packed-anchor-ref'), 'true');
  await anchor.click();
  assert.equal(await anchor.getAttribute('data-packed-anchor-clicked'), 'true');

  const reactive = page.locator('#packed-reactive-span');
  await reactive.evaluate(
    /** Mark the existing span before its consumer class changes. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-span-toggle').click();
  assert.equal(await reactive.getAttribute('data-original-node'), 'true');
  assert.equal(
    await reactive.evaluate(
      /** Read the new weight from the same span. */
      (element) => getComputedStyle(element).fontWeight,
    ),
    '700',
  );
}
