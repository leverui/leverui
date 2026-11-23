import assert from 'node:assert/strict';

/** Verify installed marks, provider styling, and live matching in Chromium. */
export async function verifyPackedHighlight(page) {
  const standalone = page.locator('#packed-mark');
  assert.equal(await standalone.textContent(), 'Standalone');
  assert.equal(await standalone.getAttribute('title'), 'Standalone mark');
  assert.match((await standalone.getAttribute('class')) ?? '', /lui-mark/);
  assert.equal(
    await standalone.evaluate(
      /** Read the installed text variant's font weight. */
      (element) => getComputedStyle(element).fontWeight,
    ),
    '500',
  );

  const inheritedElement = page.locator('strong#packed-provider-mark');
  assert.equal(await inheritedElement.count(), 1);
  assert.equal(await inheritedElement.getAttribute('title'), 'Shared element');
  assert.match((await inheritedElement.getAttribute('class')) ?? '', /provided-element/);
  assert.equal(await inheritedElement.getAttribute('as'), null);
  const overriddenElement = page.locator('mark#packed-provider-override');
  assert.equal(await overriddenElement.count(), 1);
  assert.equal(await overriddenElement.getAttribute('title'), 'Shared element');
  assert.match((await overriddenElement.getAttribute('class')) ?? '', /provided-element/);
  assert.equal(await overriddenElement.getAttribute('as'), null);

  const mark = page.locator('#packed-highlight mark');
  assert.equal(await mark.textContent(), 'Solid');
  assert.equal(await mark.getAttribute('title'), 'Provided match');
  assert.match((await mark.getAttribute('class')) ?? '', /provided-mark/);
  assert.equal(
    await mark.evaluate(
      /** Read the consumer's blue solid palette from the installed CSS. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
    'rgb(98, 84, 199)',
  );
  assert.equal(
    await mark.evaluate(
      /** Read the consumer class applied to each matched Mark. */
      (element) => getComputedStyle(element).color,
    ),
    'rgb(239, 68, 68)',
  );
  assert.equal(await page.locator('#packed-highlight-hook').textContent(), '[Solid] is fast');
  await page.locator('#packed-highlight-toggle').click();
  assert.equal(await mark.textContent(), 'fast');
  assert.equal(await page.locator('#packed-highlight-hook').textContent(), 'Solid is [fast]');
  assert.equal(
    await mark.evaluate(
      /** Read the provider's reactive text variant after the query changes. */
      (element) => getComputedStyle(element).fontWeight,
    ),
    '500',
  );
}
