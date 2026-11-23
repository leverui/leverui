import assert from 'node:assert/strict';

/** Verify installed Blockquote semantics, authored CSS, and reactivity. */
export async function verifyPackedBlockquote(page) {
  const quote = page.locator('#packed-blockquote');
  assert.equal(await quote.locator('blockquote').getAttribute('cite'), 'https://example.com');
  assert.equal(await quote.locator('figcaption cite').textContent(), 'Installed author');
  assert.match((await quote.getAttribute('class')) ?? '', /lui-blockquote/);
  assert.equal(await quote.getAttribute('variant'), null);
  assert.equal(
    await quote.evaluate(
      /** Read the installed stylesheet's solid border. */
      (element) => getComputedStyle(element).borderLeftWidth,
    ),
    '4px',
  );
  assert.equal(
    await quote.evaluate(
      /** Read the inherited initial alignment. */
      (element) => getComputedStyle(element).alignItems,
    ),
    'flex-start',
  );
  await quote.evaluate(
    /** Keep a marker on the mounted figure across the provider update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-blockquote-toggle').click();
  assert.equal(await quote.getAttribute('data-original-node'), 'true');
  assert.equal(
    await quote.evaluate(
      /** Confirm the inherited alignment changed on the existing figure. */
      (element) => getComputedStyle(element).alignItems,
    ),
    'center',
  );
}
