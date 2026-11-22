import assert from 'node:assert/strict';

/** Verify native selection, package styling, and a consumer CSS override. */
export async function verifyPackedRadioGroup(page) {
  const root = page.getByTestId('packed-radio-group-root');
  const solid = page.getByRole('radio', { name: 'Solid' });
  const indicator = page.getByTestId('packed-radio-group-indicator');
  await root.waitFor();
  assert.match(await root.getAttribute('class'), /leverui-radio-group__root/);
  assert.match(await indicator.getAttribute('class'), /leverui-radio-group__itemControl/);
  assert.equal(
    await indicator.evaluate(
      /** Read the app's plain CSS part override. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '29px',
  );
  await solid.check({ force: true });
  assert.equal(await solid.isChecked(), true);
  assert.equal(await page.getByTestId('packed-radio-group-value').textContent(), 'solid');
  assert.equal(
    await page.getByTestId('packed-radio-group-form').evaluate(
      /** Confirm the selected native radio enters browser form data. */
      (form) => new FormData(form).get('framework'),
    ),
    'solid',
  );
}
