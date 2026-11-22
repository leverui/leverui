import assert from 'node:assert/strict';

/** Verify the installed Action Bar's control, close behavior, and CSS override. */
export async function verifyPackedActionBar(page) {
  const content = page.getByTestId('packed-action-bar-content');
  assert.equal(await content.count(), 0);
  await page.getByTestId('packed-action-bar-open').click();
  await content.waitFor();
  assert.equal(await content.getAttribute('role'), 'dialog');
  assert.equal(
    await page.getByTestId('packed-action-bar-positioner').evaluate(
      /** Read the public offset override from ordinary consumer CSS. */
      (element) => getComputedStyle(element).bottom,
    ),
    '23px',
  );
  assert.equal(
    await content.evaluate(
      /** Read the consumer stylesheet on the published content slot. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '19px',
  );
  await page.getByTestId('packed-action-bar-close').click();
  await content.waitFor({ state: 'detached' });
  assert.equal(await content.count(), 0);
}
