import assert from 'node:assert/strict';

/** Verify installed Listbox selection, recipe styling, and plain CSS. */
export async function verifyPackedListbox(page) {
  const root = page.getByTestId('packed-listbox-root');
  const content = page.getByRole('listbox');
  const solid = page.getByTestId('packed-listbox-solid');
  await root.waitFor();
  assert.match(await root.getAttribute('class'), /lui-listbox__root/);
  assert.equal(
    await content.evaluate(
      /** Read the published solid-variant border. */
      (element) => getComputedStyle(element).borderTopStyle,
    ),
    'solid',
  );
  assert.equal(
    await solid.evaluate(
      /** Read the consumer's stylesheet override. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '21px',
  );
  await solid.click();
  assert.equal(await solid.getAttribute('aria-selected'), 'true');
  assert.equal(await page.getByTestId('packed-listbox-value').textContent(), 'solid');
  assert.equal(await page.getByTestId('packed-listbox-grid-next-row').textContent(), 'nine');
}
