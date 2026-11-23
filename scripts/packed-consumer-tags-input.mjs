import assert from 'node:assert/strict';

/** Verify installed Tags Input styling, keyboard entry, and native submission. */
export async function verifyPackedTagsInput(page) {
  const root = page.getByTestId('packed-tags-input-root');
  const control = page.getByTestId('packed-tags-input-control');
  const input = page.getByPlaceholder('Add framework');
  await root.waitFor();
  assert.match(await root.getAttribute('class'), /lui-tags-input__root/);
  assert.equal(
    await control.evaluate(
      /** Read the consumer's stylesheet after the packaged default CSS. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '23px',
  );
  await input.fill('React');
  await input.press('Enter');
  await page.getByTestId('packed-tags-input-value').getByText('Solid, React').waitFor();
  assert.equal(
    await page.getByTestId('packed-tags-input-form').evaluate(
      /** Read the machine-backed hidden field in the installed package. */
      (form) => new FormData(form).get('frameworks'),
    ),
    'Solid, React',
  );
}
