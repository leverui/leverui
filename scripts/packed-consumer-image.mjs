import assert from 'node:assert/strict';

/** Verify native and live Image behavior in an isolated installed consumer. */
export async function verifyPackedImage(page) {
  const image = page.locator('#packed-image');
  await image.waitFor({ state: 'visible' });
  assert.equal(await image.getAttribute('alt'), 'Packed image');
  assert.equal(await image.getAttribute('width'), '200');
  assert.equal(await image.getAttribute('height'), '100');
  assert.equal(await image.getAttribute('data-image-ref'), 'img');
  assert.equal(await image.getAttribute('fit'), null);
  assert.equal(
    await image.evaluate(
      /** Read the installed default image fit. */
      (element) => getComputedStyle(element).objectFit,
    ),
    'cover',
  );
  await image.evaluate(
    /** Mark the native image before its styled props change. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-image-toggle').click();
  assert.equal(await image.getAttribute('width'), '240');
  assert.equal(await image.getAttribute('data-original-node'), 'true');
  assert.equal(
    await image.evaluate(
      /** Read the installed image fit after the Solid update. */
      (element) => getComputedStyle(element).objectFit,
    ),
    'contain',
  );
}
