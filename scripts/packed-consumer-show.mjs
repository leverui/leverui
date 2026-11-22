import assert from 'node:assert/strict';

/** Verify the installed Show switches branches and updates in place. */
export async function verifyPackedShow(page) {
  const value = page.locator('#packed-show-value');
  const fallback = page.locator('#packed-show-fallback');
  await fallback.waitFor({ state: 'visible' });
  assert.equal(await value.count(), 0);

  await page.locator('#packed-show-reveal').click();
  await value.waitFor({ state: 'visible' });
  assert.equal(await value.textContent(), 'Value: 10');
  await value.evaluate(
    /** Tag the mounted node before updating its truthy value. */
    (element) => {
      element.dataset.originalNode = 'true';
    },
  );
  await page.locator('#packed-show-increment').click();
  assert.equal(await value.textContent(), 'Value: 11');
  assert.equal(await value.getAttribute('data-original-node'), 'true');
  await page.locator('#packed-show-hide').click();
  await fallback.waitFor({ state: 'visible' });
  assert.equal(await value.count(), 0);
}
