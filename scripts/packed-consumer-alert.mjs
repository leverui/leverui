import assert from 'node:assert/strict';

/** Verify the installed Alert's native parts, refs, and live recipe styles. */
export async function verifyPackedAlert(page) {
  const root = page.locator('#packed-alert');
  const indicator = page.locator('#packed-alert-indicator');
  const title = page.locator('#packed-alert-title');
  assert.equal(await root.getAttribute('data-alert-ref'), 'section');
  assert.equal(await root.getAttribute('role'), 'status');
  assert.equal(await title.getAttribute('data-alert-child-ref'), 'button');
  assert.equal(await title.textContent(), 'Package alert');
  assert.equal(await page.locator('#packed-alert-description').textContent(), 'Details');
  assert.match((await root.getAttribute('class')) ?? '', /lui-alert__root/);
  assert.equal(await indicator.locator('svg').getAttribute('aria-hidden'), 'true');
  assert.equal(await root.getAttribute('status'), null);

  const before = await indicator.locator('path').getAttribute('d');
  const background = await root.evaluate(
    /** Capture the installed Alert's initial recipe background. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.locator('#packed-alert-toggle').click();
  assert.notEqual(await indicator.locator('path').getAttribute('d'), before);
  assert.notEqual(
    await root.evaluate(
      /** Read the recomputed status color without replacing the root. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
    background,
  );
}
