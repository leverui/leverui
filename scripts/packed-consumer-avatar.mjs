import assert from 'node:assert/strict';

/** Verify installed Avatar geometry, fallback updates, and group composition. */
export async function verifyPackedAvatar(page) {
  const root = page.locator('[data-avatar-root="packed-avatar-machine"]');
  const fallback = root.locator('[data-avatar-fallback]');
  assert.notEqual(await root.getAttribute('data-avatar-root'), null);
  assert.equal(await fallback.textContent(), 'AL');
  assert.equal(
    await root.evaluate(
      /** Measure the installed large Avatar CSS size. */
      (element) => getComputedStyle(element).width,
    ),
    '44px',
  );
  await page.locator('#packed-avatar-change').click();
  assert.equal(await fallback.textContent(), 'GH');
  const group = page.locator('#packed-avatar-group');
  assert.equal(
    await group.evaluate(
      /** Read the installed group's selected native element. */
      (element) => element.tagName,
    ),
    'SECTION',
  );
  assert.equal(await group.getAttribute('data-avatar-group-ref'), 'section');
  assert.equal(await group.locator('[data-lui-group-item]').count(), 2);
  assert.equal(
    await group
      .locator('[data-avatar-root]')
      .first()
      .evaluate(
        /** Measure the size inherited from AvatarGroup. */
        (element) => getComputedStyle(element).width,
      ),
    '32px',
  );
}
