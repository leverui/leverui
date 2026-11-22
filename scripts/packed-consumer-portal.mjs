import assert from 'node:assert/strict';

/** Verify a custom portal container in an independent installed app. */
export async function verifyPackedPortal(page) {
  const destination = page.locator('#packed-portal-container');
  await destination.waitFor();
  const child = destination.locator('#packed-portal-child');
  await child.waitFor();
  assert.equal(await child.textContent(), 'Installed portal');
  assert.equal(await page.locator('#packed-portal-child').count(), 1);
}
