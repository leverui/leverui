import assert from 'node:assert/strict';

/** Verify the installed Select's public CSS and native form behavior. */
export async function verifyPackedSelect(page) {
  const root = page.getByTestId('packed-select-root');
  const trigger = page.getByRole('combobox', { name: 'Framework' });
  await root.waitFor();
  assert.match(await root.getAttribute('class'), /leverui-select__root/);
  assert.equal(
    await trigger.evaluate(
      /** Read the plain consumer stylesheet's override. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '31px',
  );
  await trigger.click();
  await page.getByRole('option', { name: 'Solid' }).click();
  assert.equal(await page.getByTestId('packed-select-value').textContent(), 'solid');
  assert.equal(
    await page.getByTestId('packed-select-form').evaluate(
      /** Read the native form value from the installed archive. */
      (form) => new FormData(form).get('framework'),
    ),
    'solid',
  );
}
