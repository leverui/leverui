import assert from 'node:assert/strict';

/** Verify card styles and native form behavior in the installed consumer. */
export async function verifyPackedCheckboxCard(page) {
  const root = page.locator('[data-testid="packed-card-root"]');
  const input = page.getByRole('checkbox', { name: 'Packed card choice' });
  const control = page.locator('[data-testid="packed-card-control"]');
  await root.waitFor();
  assert.equal(await input.isChecked(), false);
  assert.match(await root.getAttribute('class'), /leverui-checkbox-card/);
  assert.equal(
    await control.evaluate(
      /** Read the published card recipe from computed browser styles. */
      (element) => getComputedStyle(element).paddingTop,
    ),
    '16px',
  );
  assert.equal(
    await control.evaluate(
      /** Read the consumer's plain CSS override. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '17px',
  );
  await input.focus();
  await page.keyboard.press('Space');
  assert.equal(await input.isChecked(), true);
  const entries = await page.locator('[data-testid="packed-card-form"]').evaluate(
    /** Inspect the installed card's native form entry. */
    (form) => Array.from(new FormData(form).entries()),
  );
  assert.deepEqual(entries, [['packed-card', 'yes']]);
}
