import assert from 'node:assert/strict';

/** Verify installed selection, recipe CSS, and a plain CSS override. */
export async function verifyPackedSegmentGroup(page) {
  const root = page.getByTestId('packed-segment-group-root');
  const react = page.getByRole('radio', { name: 'React' });
  const solid = page.getByRole('radio', { name: 'Solid' });
  const item = page.locator('.leverui-segment-group__item').first();
  const indicator = page.getByTestId('packed-segment-group-indicator');
  await root.waitFor();
  assert.match(await root.getAttribute('class'), /leverui-segment-group__root/);
  assert.match(await indicator.getAttribute('class'), /leverui-segment-group__indicator/);
  assert.equal(
    await item.evaluate(
      /** Read the installed app's CSS part override. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '31px',
  );
  assert.equal(await react.isChecked(), true);
  await solid.click({ force: true });
  assert.equal(await solid.isChecked(), true);
  assert.equal(await page.getByTestId('packed-segment-group-value').textContent(), 'Solid');
  assert.equal(
    await page.getByTestId('packed-segment-group-form').evaluate(
      /** Confirm selected option enters browser form data. */
      (form) => new FormData(form).get('framework'),
    ),
    'Solid',
  );
}
