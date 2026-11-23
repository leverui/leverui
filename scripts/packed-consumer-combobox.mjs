import assert from 'node:assert/strict';

/** Verify the installed Combobox selection, form value, and CSS override. */
export async function verifyPackedCombobox(page) {
  const root = page.getByTestId('packed-combobox-root');
  const input = page.getByTestId('packed-combobox-input');
  await root.waitFor();
  assert.match(await root.getAttribute('class'), /lui-combobox__root/);
  assert.equal(
    await input.evaluate(
      /** Read the published small-size recipe. */
      (element) => getComputedStyle(element).minHeight,
    ),
    '36px',
  );
  assert.equal(
    await input.evaluate(
      /** Read the consumer's plain CSS override. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '19px',
  );
  await page.getByRole('button', { name: 'Show packed frameworks' }).click();
  await page.getByRole('option', { name: 'Solid' }).click();
  assert.equal(await input.inputValue(), 'Solid');
  assert.equal(await page.getByTestId('packed-combobox-value').textContent(), 'solid');
  const values = await page.getByTestId('packed-combobox-form').evaluate(
    /** Read the native form entry from the installed package. */
    (form) => Array.from(new FormData(form).entries()),
  );
  assert.deepEqual(values, [['packed-combobox', 'Solid']]);
}
