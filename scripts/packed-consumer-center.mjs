import assert from 'node:assert/strict';

/** Read the browser's display value from the installed native Center. */
async function display(locator) {
  return locator.evaluate(
    /** Read the resolved display after the installed CSS has loaded. */
    (element) => getComputedStyle(element).display,
  );
}

/** Require an installed layout box before comparing child alignment. */
async function requiredBox(locator) {
  const box = await locator.boundingBox();
  assert.ok(box, 'The installed Center layout box is absent.');
  return box;
}

/** Verify installed centering, native ref, inline update, and node reuse. */
export async function verifyPackedCenter(page) {
  const root = page.locator('#packed-flex-center');
  const child = page.locator('#packed-flex-center-child');
  await root.waitFor({ state: 'visible' });
  assert.deepEqual(
    await child.evaluate(
      /** Confirm the consumer CSS sizes Box without an inline style. */
      (element) => {
        const style = getComputedStyle(element);
        return [style.width, style.height, element.hasAttribute('style')];
      },
    ),
    ['40px', '20px', false],
  );
  assert.equal(await root.getAttribute('data-center-ref'), 'section');
  assert.equal(await root.getAttribute('inline'), null);
  assert.equal(await display(root), 'flex');
  const outer = await requiredBox(root);
  const inner = await requiredBox(child);
  assert.ok(Math.abs(inner.x + inner.width / 2 - outer.x - outer.width / 2) < 1.5);
  assert.ok(Math.abs(inner.y + inner.height / 2 - outer.y - outer.height / 2) < 1.5);

  await child.evaluate(
    /** Mark the mounted child to detect replacement after a signal update. */
    (element) => {
      element.dataset.originalNode = 'true';
    },
  );
  await page.locator('#packed-center-toggle').click();
  assert.equal(await display(root), 'inline-flex');
  assert.equal(await child.getAttribute('data-original-node'), 'true');
}
