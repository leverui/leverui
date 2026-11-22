import assert from 'node:assert/strict';

/** Read the browser's final positioning for a published Link part. */
function computedPosition(element) {
  return getComputedStyle(element).position;
}

/** Read the browser's final decoration for a published Link variant. */
function computedDecoration(element) {
  return getComputedStyle(element).textDecorationLine;
}

/** Verify installed Link types, recipe, provider, CSS cascade, and navigation. */
export async function verifyPackedLink(page) {
  const shared = page.locator('#packed-link-shared');
  const local = page.locator('#packed-link-local');
  const box = page.locator('#packed-link-box');
  const overlay = page.locator('#packed-link-overlay');

  assert.equal(await shared.getAttribute('data-ref-tag'), 'a');
  assert.equal(await shared.locator('span').textContent(), 'Shared destination');
  assert.equal(await shared.evaluate(computedDecoration), 'none');
  assert.equal(await local.evaluate(computedDecoration), 'underline');
  assert.equal(await page.locator('#packed-link-route').getAttribute('href'), '#packed-route');
  assert.equal(await box.evaluate(computedPosition), 'relative');
  assert.equal(await overlay.evaluate(computedPosition), 'static');
  assert.equal(await page.locator('#packed-link-inner').evaluate(computedPosition), 'relative');

  assert.equal(
    await page.locator('#packed-link-override-box').evaluate(computedPosition),
    'static',
  );
  assert.equal(
    await page.locator('#packed-link-override-overlay').evaluate(computedPosition),
    'relative',
  );

  await shared.evaluate(
    /** Mark the inherited anchor before its provider value changes. */
    (element) => element.setAttribute('data-original-link', 'true'),
  );
  await page.locator('#packed-link-toggle').click();
  assert.equal(await shared.getAttribute('data-original-link'), 'true');
  assert.equal(await shared.evaluate(computedDecoration), 'underline');

  await box.click({ position: { x: 280, y: 130 } });
  assert.match(page.url(), /#packed-article$/);
  await page.locator('#packed-link-inner').click();
  assert.match(page.url(), /#packed-inner$/);
}
