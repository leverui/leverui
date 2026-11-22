import assert from 'node:assert/strict';

/** Require a measured native layout box from the installed component. */
async function requiredBox(locator) {
  const box = await locator.boundingBox();
  assert.ok(box, 'The installed Circle layout box is absent.');
  return box;
}

/** Verify installed shape, centering, native ref, and reactive child reuse. */
export async function verifyPackedCircle(page) {
  const root = page.locator('#packed-circle');
  const child = page.locator('#packed-circle-child');
  await root.waitFor({ state: 'visible' });
  assert.equal(await root.getAttribute('data-circle-ref'), 'button');
  assert.equal(await root.getAttribute('size'), null);
  assert.equal(
    await root.evaluate(
      /** Read the installed circle's resolved corner shape. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '9999px',
  );
  const outer = await requiredBox(root);
  const inner = await requiredBox(child);
  assert.ok(Math.abs(outer.width - 32) < 1.5);
  assert.ok(Math.abs(outer.height - 32) < 1.5);
  assert.ok(Math.abs(inner.x + inner.width / 2 - outer.x - outer.width / 2) < 1.5);
  await child.evaluate(
    /** Mark the child before a live size change. */
    (element) => {
      element.dataset.originalNode = 'true';
    },
  );
  await root.click();
  assert.ok(Math.abs((await requiredBox(root)).width - 48) < 1.5);
  assert.equal(await child.getAttribute('data-original-node'), 'true');
}
