import assert from 'node:assert/strict';

/** Verify installed selection, package styling, and a plain CSS override. */
export async function verifyPackedRatingGroup(page) {
  const root = page.getByTestId('packed-rating-group-root');
  const second = page.getByRole('radio', { name: '2 stars' });
  const fourth = page.getByRole('radio', { name: '4 stars' });
  const indicator = second.locator('.leverui-rating-group__itemIndicator');
  await root.waitFor();
  assert.match(await root.getAttribute('class'), /leverui-rating-group__root/);
  assert.match(await indicator.getAttribute('class'), /leverui-rating-group__itemIndicator/);
  assert.equal(await indicator.locator('svg').count(), 2);
  assert.equal(
    await indicator.evaluate(
      /** Read the installed app's CSS part override. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '31px',
  );
  assert.equal(await second.getAttribute('aria-checked'), 'true');
  await fourth.click();
  assert.equal(await fourth.getAttribute('aria-checked'), 'true');
  assert.equal(await page.getByTestId('packed-rating-group-value').textContent(), '4');
  assert.equal(
    await page.getByTestId('packed-rating-group-form').evaluate(
      /** Confirm the selected rating enters native browser form data. */
      (form) => new FormData(form).get('score'),
    ),
    '4',
  );
}
