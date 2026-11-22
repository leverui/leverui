import assert from 'node:assert/strict';

/** Read an installed element's sticky position and top offset. */
function stickyStyle(element) {
  const style = getComputedStyle(element);
  return { position: style.position, top: style.top };
}

/** Verify installed Sticky behavior inside a native scrolling ancestor. */
export async function verifyPackedSticky(page) {
  const scroll = page.locator('#packed-sticky-scroll');
  const sticky = page.locator('#packed-sticky');
  const child = page.locator('#packed-sticky-child');
  await sticky.waitFor({ state: 'visible' });
  assert.deepEqual(await sticky.evaluate(stickyStyle), { position: 'sticky', top: '0px' });
  assert.equal(await sticky.getAttribute('data-sticky-ref'), 'button');
  await scroll.evaluate(
    /** Scroll beyond Sticky's natural position. */
    (element) => {
      element.scrollTop = 80;
    },
  );
  const scrollBox = await scroll.boundingBox();
  const stickyBox = await sticky.boundingBox();
  assert.ok(scrollBox && stickyBox);
  assert.ok(Math.abs(stickyBox.y - scrollBox.y) < 1.5);
  await child.evaluate(
    /** Mark the native child before the offset changes. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await sticky.click();
  assert.deepEqual(await sticky.evaluate(stickyStyle), { position: 'sticky', top: '16px' });
  assert.equal(await child.getAttribute('data-original-node'), 'true');
}
