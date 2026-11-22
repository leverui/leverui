import assert from 'node:assert/strict';

/** Verify installed Timeline roles, CSS, and reactive slot variants. */
export async function verifyPackedTimeline(page) {
  const root = page.locator('#packed-timeline');
  const indicator = page.locator('#packed-timeline-indicator');
  const lastSeparator = page.locator('#packed-timeline-last-separator');
  assert.equal(await root.getAttribute('data-packed-timeline-ref'), 'div');
  assert.equal(await root.getAttribute('role'), 'list');
  assert.equal(await page.locator('#packed-timeline-first').getAttribute('role'), 'listitem');
  assert.equal(await root.getAttribute('size'), null);
  assert.equal(
    await indicator.evaluate(
      /** Read the inherited small indicator size. */
      (element) => getComputedStyle(element).width,
    ),
    '16px',
  );
  await indicator.evaluate(
    /** Mark the original marker before provider updates. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-timeline-size-toggle').click();
  assert.equal(await indicator.getAttribute('data-original-node'), 'true');
  assert.equal(
    await indicator.evaluate(
      /** Read the updated large indicator size. */
      (element) => getComputedStyle(element).width,
    ),
    '32px',
  );
  assert.equal(
    await lastSeparator.evaluate(
      /** Confirm the final line is initially hidden. */
      (element) => getComputedStyle(element).display,
    ),
    'none',
  );
  await page.locator('#packed-timeline-line-toggle').click();
  assert.notEqual(
    await lastSeparator.evaluate(
      /** Confirm the final line follows the provider. */
      (element) => getComputedStyle(element).display,
    ),
    'none',
  );
  assert.equal(
    await page.locator('#packed-timeline-css-title').evaluate(
      /** Read the consumer stylesheet's final title color. */
      (element) => getComputedStyle(element).color,
    ),
    'rgb(1, 2, 3)',
  );
  await page.locator('#packed-timeline-action').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#packed-timeline-actions').textContent(), '1');
}
