import assert from 'node:assert/strict';

/** Verify the packaged component reveals browser data after mounting. */
export async function verifyPackedClientOnly(page) {
  const content = page.locator('#packed-client-content');
  await content.waitFor();
  assert.equal(await content.textContent(), '/utility.html');
  assert.equal(await page.locator('#packed-client-fallback').count(), 0);
}
