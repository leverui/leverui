import assert from 'node:assert/strict';

/** Require a measured layout box from the installed Container. */
async function requiredBox(locator) {
  const box = await locator.boundingBox();
  assert.ok(box, 'The installed Container layout box is absent.');
  return box;
}

/** Verify installed recipe layout, provider reactivity, and native refs. */
export async function verifyPackedContainer(page) {
  const root = page.locator('#packed-container');
  const child = page.locator('#packed-container-child');
  await root.waitFor({ state: 'visible' });
  assert.equal(await root.getAttribute('data-container-ref'), 'section');
  assert.equal(await root.getAttribute('fluid'), null);
  assert.ok(Math.abs((await requiredBox(root)).width - 1440) < 1.5);
  await child.evaluate(
    /** Mark the child before a provider variant update. */
    (element) => {
      element.dataset.originalNode = 'true';
    },
  );
  await page.locator('#packed-container-toggle').click();
  assert.ok(Math.abs((await requiredBox(root)).width - 1600) < 1.5);
  assert.equal(await child.getAttribute('data-original-node'), 'true');
}
