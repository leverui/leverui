import assert from 'node:assert/strict';

/** Verify installed Collapsible behavior and a consumer-owned CSS rule. */
export async function verifyPackedCollapsible(page) {
  const trigger = page.getByTestId('packed-collapsible-trigger');
  const content = page.getByTestId('packed-collapsible-content');
  await trigger.waitFor();
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
  await trigger.click();
  await content.waitFor({ state: 'visible' });
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
  assert.equal(
    await content.evaluate(
      /** Read the consumer stylesheet on the installed content slot. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '23px',
  );
  await trigger.click();
  await content.waitFor({ state: 'hidden' });
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
}
