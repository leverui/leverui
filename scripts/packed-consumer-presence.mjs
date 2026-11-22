import assert from 'node:assert/strict';

/** Verify installed Presence state and native styling in a separate browser app. */
export async function verifyPackedPresence(page) {
  const content = page.locator('#packed-presence-content');
  await content.waitFor({ state: 'attached' });
  assert.equal(await content.isVisible(), false);
  await page.locator('#packed-presence-toggle').click();
  await content.waitFor({ state: 'visible' });
  assert.equal(await content.textContent(), 'Installed presence');
  assert.equal(
    await content.evaluate(
      /** Read the token resolved by the consumer's native style. */
      (element) => getComputedStyle(element).paddingTop,
    ),
    '16px',
  );
  await page.locator('#packed-presence-toggle').click();
  await content.waitFor({ state: 'hidden' });
}
