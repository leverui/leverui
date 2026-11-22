import assert from 'node:assert/strict';

/** Verify the installed locale provider and filter in an independent browser app. */
export async function verifyPackedLocale(page) {
  const probe = page.locator('#packed-locale');
  await probe.waitFor({ state: 'attached' });
  assert.equal(await probe.getAttribute('data-locale'), 'tr-TR');
  assert.equal(await probe.getAttribute('data-dir'), 'ltr');
  assert.equal(await probe.getAttribute('data-matches'), 'true');
}
