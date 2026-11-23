import assert from 'node:assert/strict';

/** Verify an installed Toggle's style hook, pressed state, and form behavior. */
export async function verifyPackedToggle(page) {
  const root = page.getByRole('button', { name: 'Packed Bold', exact: true });
  await root.waitFor();
  assert.equal(await root.getAttribute('data-testid'), 'packed-toggle-root');
  assert.match(await root.getAttribute('class'), /lui-toggle__root/);
  assert.equal(
    await root.evaluate(
      /** Read the consumer stylesheet after the library's runtime rules. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '23px',
  );
  assert.equal(await root.getAttribute('aria-pressed'), 'false');
  await root.click();
  await root.getByText('On', { exact: true }).waitFor();
  assert.equal(await root.getAttribute('aria-pressed'), 'true');
  assert.equal(await root.getAttribute('aria-label'), 'Packed Bold');
  assert.deepEqual(
    await page.getByTestId('packed-toggle-form').evaluate(
      /** Confirm Toggle's native button adds no submitted form field. */
      (form) => [...new FormData(form).entries()],
    ),
    [],
  );
  await root.press('Space');
  await root.getByText('Off', { exact: true }).waitFor();
  assert.equal(await root.getAttribute('aria-pressed'), 'false');
  assert.equal(await root.getAttribute('aria-label'), 'Packed Bold');
}
