import assert from 'node:assert/strict';

/** Verify installed Progress semantics, refs, and changing recipe styles. */
export async function verifyPackedProgress(page) {
  const root = page.locator('[data-progress-root="packed-progress"]');
  const label = page.locator('#packed-progress-label');
  const track = page.locator('#packed-progress-track');
  const range = page.locator('#packed-progress-range');
  assert.equal(await root.getAttribute('data-progress-root-ref'), 'section');
  assert.equal(await label.getAttribute('data-progress-parent-label-ref'), 'span');
  assert.equal(await label.getAttribute('data-progress-owned-label-ref'), 'span');
  assert.equal(await track.getAttribute('data-progress-parent-track-ref'), 'div');
  assert.equal(await track.getAttribute('data-progress-owned-track-ref'), 'div');
  assert.equal(await track.getAttribute('data-progress-track-owner'), 'consumer');
  assert.equal(await track.getAttribute('role'), 'progressbar');
  assert.equal(await track.getAttribute('aria-labelledby'), 'packed-progress-label');
  assert.equal(
    await page.getByRole('progressbar', { name: 'Uploading' }).getAttribute('id'),
    'packed-progress-track',
  );
  assert.equal(await track.getAttribute('aria-valuenow'), '25');
  assert.match((await range.getAttribute('style')) ?? '', /width: 25%/);
  assert.equal(await page.locator('#packed-progress-value').textContent(), '25%');
  assert.equal(
    await page.locator('#packed-progress-value').getAttribute('data-progress-value-text-ref'),
    'output',
  );
  assert.equal(
    await track.evaluate(
      /** Read the installed small-size track height. */
      (element) => getComputedStyle(element).height,
    ),
    '8px',
  );
  await range.evaluate(
    /** Mark the native range before updating the installed machine. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-progress-toggle').click();
  assert.equal(await track.getAttribute('aria-valuenow'), '75');
  assert.equal(
    await page.getByRole('progressbar', { name: 'Uploading' }).getAttribute('id'),
    'packed-progress-track',
  );
  assert.equal(await range.getAttribute('data-original-node'), 'true');
  assert.match((await range.getAttribute('style')) ?? '', /width: 75%/);
  assert.equal(
    await track.evaluate(
      /** Read the installed large-size track height. */
      (element) => getComputedStyle(element).height,
    ),
    '12px',
  );
  await page.locator('#packed-progress-external-toggle').click();
  assert.equal(
    await page.locator('#packed-progress-external-track').getAttribute('aria-valuenow'),
    '80',
  );
}
