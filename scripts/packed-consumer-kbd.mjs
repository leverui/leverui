import assert from 'node:assert/strict';

/** Read the installed Kbd stylesheet's computed height. */
function computedHeight(element) {
  return getComputedStyle(element).height;
}

/** Verify packaged Kbd markup, styles, refs, and mounted provider updates. */
export async function verifyPackedKbd(page) {
  const first = page.locator('#packed-kbd-first');
  const second = page.locator('#packed-kbd-second');
  const fixed = page.locator('#packed-kbd-fixed');
  assert.equal(await page.locator('kbd#packed-kbd-default').count(), 1);
  assert.match((await first.getAttribute('class')) ?? '', /provider-kbd/);
  assert.match((await fixed.getAttribute('class')) ?? '', /provider-kbd/);
  assert.match((await fixed.getAttribute('class')) ?? '', /fixed-kbd/);
  assert.equal(await first.getAttribute('title'), null);
  assert.equal(await first.getAttribute('size'), null);
  assert.equal(await first.getAttribute('variant'), null);
  assert.equal(await first.locator('span').textContent(), 'Esc');
  assert.equal(await second.locator('span').textContent(), 'Esc');
  assert.equal(
    await first.evaluate(
      /** Confirm the two inherited labels are separate browser nodes. */
      (element) =>
        element.querySelector('span') !== document.querySelector('#packed-kbd-second span'),
    ),
    true,
  );
  assert.equal(await first.evaluate(computedHeight), '18px');
  assert.equal(await fixed.evaluate(computedHeight), '20px');
  assert.equal(
    await page.locator('#packed-kbd-custom').evaluate(
      /** Confirm consumer CSS overrides the installed default background. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
    'rgb(91, 52, 122)',
  );
  assert.equal(await page.locator('#packed-kbd-span').getAttribute('data-ref-tag'), 'span');
  const child = page.locator('#packed-kbd-child');
  assert.equal(await child.getAttribute('data-parent-ref'), 'true');
  assert.equal(await child.getAttribute('data-child-ref'), 'true');
  assert.equal(await child.getAttribute('aria-label'), 'Command key');
  assert.match((await child.getAttribute('class')) ?? '', /leverui-kbd/);
  assert.equal(
    await page.locator('#packed-kbd-default').evaluate(
      /** Confirm the installed stylesheet applies Kbd's base display. */
      (element) => getComputedStyle(element).display,
    ),
    'inline-flex',
  );

  await first.evaluate(
    /** Mark the installed node before changing provider size. */
    (element) => element.setAttribute('data-original-kbd', 'true'),
  );
  await page.locator('#packed-kbd-toggle').click();
  assert.equal(await first.getAttribute('data-original-kbd'), 'true');
  assert.equal(await first.evaluate(computedHeight), '24px');
  assert.equal(await second.evaluate(computedHeight), '24px');
  assert.equal(await fixed.evaluate(computedHeight), '20px');
}
