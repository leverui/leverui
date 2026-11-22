import assert from 'node:assert/strict';

/** Verify installed Group indexing and live layout in Chromium. */
export async function verifyPackedGroup(page) {
  const group = page.locator('#packed-group');
  const first = page.locator('#packed-group-first');
  const last = page.locator('#packed-group-last');
  const child = page.locator('#packed-group-child');
  await group.waitFor({ state: 'visible' });
  assert.equal(await group.getAttribute('data-group-ref'), 'section');
  assert.equal(await group.getAttribute('orientation'), null);
  assert.equal(
    await group.evaluate(
      /** Read the installed horizontal direction. */
      (element) => getComputedStyle(element).flexDirection,
    ),
    'row',
  );
  assert.equal(await first.getAttribute('data-leverui-group-first'), '');
  assert.equal(await last.getAttribute('data-leverui-group-last'), '');
  assert.equal(
    await page.locator('#packed-group-separator').getAttribute('data-leverui-group-auto-skip'),
    '',
  );
  assert.equal(
    await first.evaluate(
      /** Read the installed group count variable. */
      (element) => getComputedStyle(element).getPropertyValue('--leverui-group-count').trim(),
    ),
    '2',
  );
  await child.evaluate(
    /** Mark the mounted child before changing orientation. */
    (element) => {
      element.dataset.originalNode = 'true';
    },
  );
  await first.click();
  assert.equal(
    await group.evaluate(
      /** Read the updated vertical direction. */
      (element) => getComputedStyle(element).flexDirection,
    ),
    'column',
  );
  assert.equal(await child.getAttribute('data-original-node'), 'true');
}
