import assert from 'node:assert/strict';

/** Verify installed SVG semantics, refs, CSS, and machine updates. */
export async function verifyPackedProgressCircle(page) {
  const circle = page.locator('#packed-circle-svg');
  const range = page.locator('#packed-circle-range');
  assert.equal(await circle.getAttribute('data-circle-ref'), 'svg');
  assert.equal(await circle.getAttribute('role'), 'progressbar');
  assert.equal(await circle.getAttribute('aria-labelledby'), 'packed-circle-label');
  assert.equal(
    await page.getByRole('progressbar', { name: 'Uploading' }).getAttribute('id'),
    'packed-circle-svg',
  );
  assert.equal(await circle.getAttribute('aria-valuenow'), '25');
  assert.equal(await page.locator('#packed-circle-value').textContent(), '25%');
  assert.equal(
    await page.locator('#packed-circle-track').evaluate(
      /** Read the consumer's public thickness override. */
      (element) => getComputedStyle(element).strokeWidth,
    ),
    '9px',
  );
  assert.equal(
    await circle.evaluate(
      /** Read the installed small recipe size. */
      (element) => getComputedStyle(element).width,
    ),
    '32px',
  );
  await range.evaluate(
    /** Mark the native arc before updating the installed machine. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-circle-toggle').click();
  assert.equal(await circle.getAttribute('aria-valuenow'), '75');
  assert.equal(await range.getAttribute('data-original-node'), 'true');
  assert.equal(await page.locator('#packed-circle-value').textContent(), '75%');
  assert.equal(
    await circle.evaluate(
      /** Read the installed large recipe size. */
      (element) => getComputedStyle(element).width,
    ),
    '48px',
  );
  await page.locator('#packed-circle-external-toggle').click();
  assert.equal(await page.locator('#packed-circle-external').getAttribute('aria-valuenow'), '80');
}
