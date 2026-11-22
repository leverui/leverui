import assert from 'node:assert/strict';

/** Verify installed Badge rendering, authored size, and reactive provider values. */
export async function verifyPackedBadge(page) {
  const solid = page.locator('#packed-badge-solid');
  assert.equal(await solid.textContent(), 'Active');
  assert.equal(await solid.getAttribute('title'), 'Package status');
  assert.match((await solid.getAttribute('class')) ?? '', /leverui-badge/);
  assert.equal(await solid.getAttribute('variant'), null);
  assert.equal(
    await solid.evaluate(
      /** Read the installed solid palette from computed browser styles. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
    'rgb(98, 84, 199)',
  );

  const inherited = page.locator('#packed-badge-inherited');
  const fixed = page.locator('#packed-badge-fixed');
  assert.match((await inherited.getAttribute('class')) ?? '', /provider-badge/);
  assert.match((await fixed.getAttribute('class')) ?? '', /provider-badge/);
  assert.match((await fixed.getAttribute('class')) ?? '', /fixed-badge/);
  assert.equal(
    await inherited.evaluate(
      /** Measure the provider's initial Badge size. */
      (element) => getComputedStyle(element).minHeight,
    ),
    '16px',
  );
  await page.locator('#packed-badge-toggle').click();
  assert.equal(
    await inherited.evaluate(
      /** Measure the provider's updated Badge size. */
      (element) => getComputedStyle(element).minHeight,
    ),
    '28px',
  );
  assert.equal(
    await fixed.evaluate(
      /** Confirm an explicit Badge size does not follow the provider. */
      (element) => getComputedStyle(element).minHeight,
    ),
    '20px',
  );
  const section = page.locator('#packed-badge-section');
  assert.equal(await section.getAttribute('data-badge-ref'), 'section');
  assert.equal(
    await section.evaluate(/** Read the selected native element. */ (element) => element.tagName),
    'SECTION',
  );
}
