import assert from 'node:assert/strict';

/** Verify the installed component clips pixels without removing semantics. */
export async function verifyPackedVisuallyHidden(page) {
  const button = page.getByRole('button', { name: '4 Unread messages' });
  const hiddenText = page.locator('#packed-hidden-text');
  const input = page.locator('#packed-hidden-input');
  await button.waitFor({ state: 'visible' });
  assert.equal(await hiddenText.count(), 1);
  assert.equal(
    await hiddenText.evaluate(
      /** Read the CSS applied by the installed package. */
      (element) => getComputedStyle(element).width,
    ),
    '1px',
  );
  assert.equal(await input.getAttribute('data-packed-parent'), 'true');
  assert.equal(await input.getAttribute('aria-label'), 'Packed hidden input');
  assert.equal(await page.locator('#packed-visually-hidden > span').count(), 0);
  await button.focus();
  await page.keyboard.press('Tab');
  assert.equal(
    await input.evaluate(
      /** Confirm the visually hidden input still receives keyboard focus. */
      (element) => element === document.activeElement,
    ),
    true,
  );
}
