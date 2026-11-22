import assert from 'node:assert/strict';

/** Read a rendered margin property from the installed element. */
async function margin(locator, property) {
  return locator.evaluate(
    /** Read the browser's computed logical margin. */
    (element, name) => getComputedStyle(element).getPropertyValue(name),
    property,
  );
}

/** Verify installed logical layout, RTL, refs, and live node reuse. */
export async function verifyPackedBleed(page) {
  const root = page.locator('#packed-bleed');
  await root.waitFor({ state: 'visible' });
  assert.equal(await root.getAttribute('data-bleed-ref'), 'section');
  assert.equal(await root.getAttribute('inline'), null);
  assert.equal(await margin(root, 'margin-inline-start'), '-16px');
  assert.equal(await margin(root, 'margin-inline-end'), '-16px');
  assert.equal(await margin(root, 'margin-block-start'), '-8px');

  const parent = await page.locator('#packed-bleed-parent').boundingBox();
  const initial = await root.boundingBox();
  assert.ok(parent && initial, 'The installed Bleed layout box is absent.');
  assert.ok(Math.abs(initial.x - parent.x - 16) < 1.5);
  await root.evaluate(
    /** Mark the native element to detect replacement after a signal update. */
    (element) => {
      element.dataset.originalNode = 'true';
    },
  );
  await page.locator('#packed-bleed-toggle').click();
  assert.equal(await margin(root, 'margin-inline-start'), '-32px');
  assert.equal(await root.getAttribute('data-original-node'), 'true');
  const updated = await root.boundingBox();
  assert.ok(updated, 'The updated Bleed layout box is absent.');
  assert.ok(Math.abs(updated.x - parent.x) < 1.5);

  const rtl = page.locator('#packed-rtl-bleed');
  assert.equal(await margin(rtl, 'margin-right'), '-32px');
  assert.equal(await margin(rtl, 'margin-left'), '0px');
}
