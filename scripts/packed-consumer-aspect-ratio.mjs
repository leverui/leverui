import assert from 'node:assert/strict';

/** Read an installed element's actual CSS layout box. */
async function requiredBox(locator) {
  const box = await locator.boundingBox();
  assert.ok(box, 'The packed aspect-ratio layout box is absent.');
  return box;
}

/** Compare dimensions within subpixel browser rounding. */
function expectNear(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1.5, `Expected ${actual} to be near ${expected}.`);
}

/** Require the installed child to fill its ratio box. */
async function expectChildFill(root, child) {
  const outer = await requiredBox(root);
  const inner = await requiredBox(child);
  expectNear(inner.x, outer.x);
  expectNear(inner.y, outer.y);
  expectNear(inner.width, outer.width);
  expectNear(inner.height, outer.height);
}

/** Verify packed layout, media fit, native ref, and reactive node reuse. */
export async function verifyPackedAspectRatio(page) {
  const root = page.locator('#packed-ratio');
  const child = page.locator('#packed-ratio-child');
  await root.waitFor({ state: 'visible' });
  assert.equal(await root.getAttribute('data-ratio-ref'), 'section');
  assert.equal(await root.getAttribute('ratio'), null);
  expectNear((await requiredBox(root)).height, 240);
  await expectChildFill(root, child);
  await child.evaluate(
    /** Tag the mounted child to detect replacement after a ratio update. */
    (element) => {
      element.dataset.originalNode = 'true';
    },
  );
  await page.locator('#packed-ratio-toggle').click();
  expectNear((await requiredBox(root)).height, 135);
  assert.equal(await child.getAttribute('data-original-node'), 'true');
  await expectChildFill(root, child);

  const imageRoot = page.locator('#packed-image-ratio');
  const image = page.getByRole('img', { name: 'Packed ratio image' });
  expectNear((await requiredBox(imageRoot)).height, 90);
  await expectChildFill(imageRoot, image);
  assert.equal(
    await image.evaluate(
      /** Read the media fit from installed component CSS. */
      (element) => getComputedStyle(element).objectFit,
    ),
    'cover',
  );
}
