import assert from 'node:assert/strict';

/** Check the installed QR machine, recipe, CSS override, and update path. */
export async function verifyPackedQrCode(page) {
  const root = page.locator('[data-qr-code-root="packed-qr"]');
  const frame = page.locator('[data-qr-code-frame="packed-qr"]');
  const path = frame.locator('path');
  assert.notEqual(await root.getAttribute('data-qr-code-root'), null);
  assert.equal(await root.evaluate((element) => element.tagName), 'SECTION');
  assert.equal(await root.getAttribute('data-packed-qr-ref'), 'section');
  assert.equal(await root.getAttribute('as'), null);
  assert.equal(await frame.getAttribute('width'), '96');
  assert.equal(await frame.getAttribute('height'), '96');
  assert.equal(await frame.getAttribute('htmlWidth'), null);
  assert.equal(await frame.getAttribute('data-packed-svg-ref'), 'true');
  const overlay = page.getByTestId('packed-qr-button-overlay');
  assert.equal(await overlay.evaluate((element) => element.tagName), 'BUTTON');
  assert.equal(await overlay.getAttribute('disabled'), null);
  assert.equal(await overlay.getAttribute('data-packed-button-ref'), 'true');
  await overlay.click();
  assert.equal(await overlay.getAttribute('data-packed-button-clicked'), 'true');
  assert.equal(
    await frame.evaluate(
      /** Read the installed QR frame's computed size. */
      (element) => getComputedStyle(element).width,
    ),
    '80px',
  );
  assert.equal(
    await frame.evaluate(
      /** Confirm ordinary consumer CSS overrides the recipe fill. */
      (element) => getComputedStyle(element).fill,
    ),
    'rgb(9, 8, 7)',
  );
  const initialPath = await path.getAttribute('d');
  assert.ok(initialPath);
  await page.locator('#packed-qr-update').click();
  assert.notEqual(await path.getAttribute('d'), initialPath);
}
