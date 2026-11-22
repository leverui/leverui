import assert from 'node:assert/strict';

/** Require a measured installed Flex item before comparing geometry. */
async function requiredBox(locator) {
  const box = await locator.boundingBox();
  assert.ok(box, 'The installed Flex layout box is absent.');
  return box;
}

/** Verify installed aliases, native ref, signal updates, and child identity. */
export async function verifyPackedFlex(page) {
  const root = page.locator('#packed-flex');
  const child = page.locator('#packed-flex-child');
  const second = page.locator('#packed-flex-second');
  await root.waitFor({ state: 'visible' });
  assert.deepEqual(
    await child.evaluate(
      /** Confirm the consumer CSS sizes Box without an inline style. */
      (element) => {
        const style = getComputedStyle(element);
        return [style.width, style.height, element.hasAttribute('style')];
      },
    ),
    ['20px', '10px', false],
  );
  assert.equal(await root.getAttribute('data-flex-ref'), 'button');
  assert.equal(await root.getAttribute('direction'), null);
  assert.equal(
    await root.evaluate(
      /** Read the installed root's resolved display. */
      (element) => getComputedStyle(element).display,
    ),
    'flex',
  );
  const firstBox = await requiredBox(child);
  const secondBox = await requiredBox(second);
  assert.ok(Math.abs(secondBox.x - firstBox.x - firstBox.width - 16) < 1.5);
  await child.evaluate(
    /** Mark the mounted child before changing direction. */
    (element) => {
      element.dataset.originalNode = 'true';
    },
  );
  await root.click();
  assert.equal(
    await root.evaluate(
      /** Read the direction after the native button click. */
      (element) => getComputedStyle(element).flexDirection,
    ),
    'column',
  );
  assert.equal(await child.getAttribute('data-original-node'), 'true');
}
