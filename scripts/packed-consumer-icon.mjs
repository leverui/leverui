import assert from 'node:assert/strict';

/** Verify the installed Icon family in a bundled Chromium consumer. */
export async function verifyPackedIcon(page) {
  const inherited = page.locator('#packed-icon-inherited');
  const fixed = page.locator('#packed-icon-fixed');
  assert.equal(await inherited.count(), 1);
  assert.equal(await inherited.getAttribute('focusable'), 'false');
  assert.equal(await inherited.getAttribute('aria-hidden'), 'true');
  assert.equal(await inherited.getAttribute('title'), 'Packed shared icon');
  assert.equal(await inherited.getAttribute('size'), null);
  assert.equal(
    await inherited.evaluate(
      /** Read the installed authored CSS's inherited width. */
      (element) => getComputedStyle(element).width,
    ),
    '12px',
  );
  assert.equal(
    await fixed.evaluate(
      /** Read the locally selected authored width. */
      (element) => getComputedStyle(element).width,
    ),
    '16px',
  );
  const child = page.locator('#packed-icon-child');
  assert.equal(await child.getAttribute('viewBox'), '0 0 32 32');
  assert.equal(await child.getAttribute('aria-hidden'), 'true');
  assert.equal(await page.locator('span#packed-icon-provider-as').count(), 1);
  assert.equal(await page.locator('svg#packed-icon-provider-as-override').count(), 1);
  assert.equal(await page.locator('#packed-icon-provider-as').getAttribute('title'), 'Packed tag');
  assert.equal(await page.locator('#packed-icon-provider-as').getAttribute('as'), null);
  assert.equal(
    await page.locator('#packed-icon-shared-first path').getAttribute('d'),
    'M5 5h14v14H5z',
  );
  assert.equal(
    await page.locator('#packed-icon-shared-second path').getAttribute('d'),
    'M5 5h14v14H5z',
  );
  assert.equal(await page.locator('#packed-icon-fallback path').getAttribute('d'), 'M1 1h2v2H1z');
  assert.equal(await page.locator('#packed-icon-created path').getAttribute('d'), 'M3 3h18v18H3z');
  assert.equal(
    await page.locator('#packed-icon-created').evaluate(
      /** Read the consumer's public size variable override. */
      (element) => getComputedStyle(element).width,
    ),
    '31px',
  );
  await inherited.evaluate(
    /** Mark the original SVG before the provider updates. */
    (element) => element.setAttribute('data-original-icon', 'true'),
  );
  await page.locator('#packed-icon-toggle').click();
  assert.equal(await inherited.getAttribute('data-original-icon'), 'true');
  assert.equal(
    await inherited.evaluate(
      /** Read the changed provider size on the preserved element. */
      (element) => getComputedStyle(element).width,
    ),
    '24px',
  );
}
