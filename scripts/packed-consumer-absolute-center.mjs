import assert from 'node:assert/strict';

/** Measure the selected center relative to its installed parent. */
async function centerOffset(page, parentId, childId) {
  const parent = await page.locator(parentId).boundingBox();
  const child = await page.locator(childId).boundingBox();
  assert.ok(parent && child, `Missing installed layout box for ${childId}.`);
  return {
    x: child.x + child.width / 2 - parent.x - parent.width / 2,
    y: child.y + child.height / 2 - parent.y - parent.height / 2,
    top: child.y - parent.y,
  };
}

/** Verify installed layout, RTL direction, native ref, and reactive axis. */
export async function verifyPackedAbsoluteCenter(page) {
  const center = page.locator('#packed-center');
  await center.waitFor({ state: 'visible' });
  assert.equal(await center.getAttribute('data-ref-tag'), 'section');
  assert.equal(await center.getAttribute('axis'), null);
  const initial = await centerOffset(page, '#packed-center-parent', '#packed-center');
  assert.ok(Math.abs(initial.x) < 1.5);
  assert.ok(Math.abs(initial.y) < 1.5);

  const rtl = page.locator('#packed-rtl-center');
  const rtlOffset = await centerOffset(page, '#packed-rtl-center-parent', '#packed-rtl-center');
  assert.ok(Math.abs(rtlOffset.x) < 1.5);
  assert.ok(Math.abs(rtlOffset.top - 12) < 1.5);
  assert.equal(
    await rtl.evaluate(
      /** Read the direction-specific translation from the installed CSS. */
      (element) => getComputedStyle(element).translate,
    ),
    '50%',
  );

  await page.locator('#packed-axis-toggle').click();
  assert.equal(await center.getAttribute('data-ref-tag'), 'section');
  assert.equal(
    await center.evaluate(
      /** Confirm the live axis changed on the same native element. */
      (element) => getComputedStyle(element).translate,
    ),
    '-50%',
  );
  const changed = await centerOffset(page, '#packed-center-parent', '#packed-center');
  assert.ok(Math.abs(changed.x) < 1.5);
}
