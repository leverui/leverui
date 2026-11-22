import assert from 'node:assert/strict';

/** Verify the installed Accordion's initial state, interaction, and CSS override. */
export async function verifyPackedAccordion(page) {
  const first = page.getByTestId('packed-accordion-first');
  const second = page.getByTestId('packed-accordion-second');
  await second.waitFor();
  assert.equal(await second.getAttribute('aria-expanded'), 'true');
  assert.equal(await first.getAttribute('aria-expanded'), 'false');
  assert.equal(
    await first.evaluate(
      /** Read the consumer stylesheet on the published trigger. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '17px',
  );
  await first.click();
  assert.equal(await first.getAttribute('aria-expanded'), 'true');
  assert.equal(await second.getAttribute('aria-expanded'), 'false');
  assert.equal(await page.getByText('First packed content').isVisible(), true);
  const inherited = page.getByTestId('packed-accordion-inherited');
  await inherited.waitFor();
  assert.equal(await page.getByText('Packed inherited content').count(), 0);
  await inherited.click();
  assert.equal(await inherited.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.getByText('Packed inherited content').isVisible(), true);
}
