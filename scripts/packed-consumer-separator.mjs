import assert from 'node:assert/strict';

/** Verify installed separator semantics, CSS priority, and provider reactivity. */
export async function verifyPackedSeparator(page) {
  const native = page.locator('#packed-native-separator');
  assert.equal(await native.getAttribute('role'), 'separator');
  assert.equal(await native.getAttribute('aria-orientation'), 'horizontal');
  assert.equal(await native.getAttribute('data-packed-separator-ref'), 'span');
  assert.equal(
    await native.evaluate(
      /** Read the default divider thickness in the consumer browser. */
      (element) => getComputedStyle(element).borderTopWidth,
    ),
    '1px',
  );
  assert.equal(
    await page.locator('#packed-css-separator').evaluate(
      /** Read the consumer stylesheet's border color. */
      (element) => getComputedStyle(element).borderTopColor,
    ),
    'rgb(1, 2, 3)',
  );

  const selected = page.locator('#packed-selected-separator');
  assert.equal(
    await selected.evaluate(
      /** Read the selected native divider tag. */
      (element) => element.tagName,
    ),
    'DIV',
  );
  assert.equal(await selected.getAttribute('data-packed-selected-ref'), 'true');
  assert.equal(await selected.getAttribute('aria-orientation'), 'vertical');

  const providerOrientation = page.locator('#packed-provider-orientation-separator');
  assert.equal(await providerOrientation.getAttribute('aria-orientation'), 'horizontal');
  assert.equal(
    await providerOrientation.evaluate(
      /** Confirm the provider still selects the vertical CSS orientation. */
      (element) => getComputedStyle(element).borderInlineStartWidth,
    ),
    '1px',
  );

  const inherited = page.locator('#packed-inherited-separator');
  await inherited.evaluate(
    /** Mark the existing span before updating provider defaults. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-separator-toggle').click();
  assert.equal(await inherited.getAttribute('data-original-node'), 'true');
  assert.equal(
    await inherited.evaluate(
      /** Read the provider-updated divider thickness. */
      (element) => getComputedStyle(element).borderTopWidth,
    ),
    '3px',
  );
}
