import assert from 'node:assert/strict';

/** Measure an installed Float relative to its positioned parent. */
async function placement(page) {
  const parent = await page.locator('#packed-float-parent').boundingBox();
  const child = await page.locator('#packed-float').boundingBox();
  assert.ok(parent && child, 'Packed Float layout box is absent.');
  return { x: child.x - parent.x, y: child.y - parent.y };
}

/** Verify installed Float geometry, native props, and reactive movement. */
export async function verifyPackedFloat(page) {
  const parent = page.locator('#packed-float-parent');
  const root = page.locator('#packed-float');
  const child = page.locator('#packed-float-child');
  await root.waitFor({ state: 'visible' });
  assert.deepEqual(
    await parent.evaluate(
      /** Confirm a consumer stylesheet positions and sizes the native Box. */
      (element) => {
        const style = getComputedStyle(element);
        return [style.position, style.width, style.height, element.hasAttribute('style')];
      },
    ),
    ['relative', '200px', '120px', false],
  );
  assert.equal(await root.getAttribute('data-float-ref'), 'button');
  assert.equal(await root.getAttribute('placement'), null);
  assert.equal(
    await root.evaluate(
      /** Read the native root's absolute positioning. */
      (element) => getComputedStyle(element).position,
    ),
    'absolute',
  );
  const initial = await placement(page);
  assert.ok(Math.abs(initial.x + 10) < 1.5);
  assert.ok(Math.abs(initial.y + 10) < 1.5);
  await child.evaluate(
    /** Mark the mounted child before moving its parent. */
    (element) => {
      element.dataset.originalNode = 'true';
    },
  );
  await root.click();
  const moved = await placement(page);
  assert.ok(Math.abs(moved.x - 190) < 1.5);
  assert.ok(Math.abs(moved.y - 110) < 1.5);
  assert.equal(await child.getAttribute('data-original-node'), 'true');
}
