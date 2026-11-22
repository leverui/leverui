import assert from 'node:assert/strict';

/** Require a measured native layout box from the installed Square. */
async function requiredBox(locator) {
  const box = await locator.boundingBox();
  assert.ok(box, 'The installed Square layout box is absent.');
  return box;
}

/** Verify installed sizing, centering, native ref, and reactive child reuse. */
export async function verifyPackedSquare(page) {
  const root = page.locator('#packed-square');
  const child = page.locator('#packed-square-child');
  await root.waitFor({ state: 'visible' });
  assert.equal(await root.getAttribute('data-square-ref'), 'button');
  assert.equal(await root.getAttribute('size'), null);
  assert.equal(
    await root.evaluate(
      /** Read the native Square's flex display. */
      (element) => getComputedStyle(element).display,
    ),
    'flex',
  );
  const outer = await requiredBox(root);
  const inner = await requiredBox(child);
  assert.ok(Math.abs(outer.width - 32) < 1.5);
  assert.ok(Math.abs(outer.height - 32) < 1.5);
  assert.ok(Math.abs(inner.x + inner.width / 2 - outer.x - outer.width / 2) < 1.5);
  await child.evaluate(
    /** Mark the child before its parent's live size change. */
    (element) => {
      element.dataset.originalNode = 'true';
    },
  );
  await root.click();
  assert.ok(Math.abs((await requiredBox(root)).width - 48) < 1.5);
  assert.equal(await child.getAttribute('data-original-node'), 'true');
}
