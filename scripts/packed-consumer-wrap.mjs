import assert from 'node:assert/strict';

/** Read an installed Wrap element's layout styles. */
function wrapStyle(element) {
  const style = getComputedStyle(element);
  return { display: style.display, wrap: style.flexWrap, gap: style.gap };
}

/** Verify installed Wrap layout and live item behavior in Chromium. */
export async function verifyPackedWrap(page) {
  const wrap = page.locator('#packed-wrap');
  const item = page.locator('#packed-wrap-item');
  const second = page.locator('#packed-wrap-second');
  const third = page.locator('#packed-wrap-third');
  const child = page.locator('#packed-wrap-child');
  await wrap.waitFor({ state: 'visible' });
  assert.deepEqual(await wrap.evaluate(wrapStyle), { display: 'flex', wrap: 'wrap', gap: '8px' });
  assert.equal(await item.getAttribute('data-wrap-ref'), 'button');
  const firstBox = await item.boundingBox();
  const secondBox = await second.boundingBox();
  const thirdBox = await third.boundingBox();
  assert.ok(firstBox && secondBox && thirdBox);
  assert.ok(Math.abs(secondBox.x - firstBox.x - 56) < 1.5);
  assert.ok(Math.abs(thirdBox.y - firstBox.y - 32) < 1.5);
  await child.evaluate(
    /** Mark the native child before its parent changes spacing. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await item.click();
  assert.equal((await wrap.evaluate(wrapStyle)).gap, '16px');
  assert.equal(await child.getAttribute('data-original-node'), 'true');
}
