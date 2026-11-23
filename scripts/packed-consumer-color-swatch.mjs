import assert from 'node:assert/strict';

/** Verify published swatch CSS, mix layout, and reactive provider defaults. */
export async function verifyPackedColorSwatch(page) {
  const alpha = page.locator('#packed-swatch-alpha');
  assert.equal(await alpha.getAttribute('data-value'), 'rgba(255, 0, 0, 0.5)');
  assert.match((await alpha.getAttribute('class')) ?? '', /lui-color-swatch/);
  assert.equal(
    await alpha.evaluate(
      /** Read the installed swatch's default size. */
      (element) => getComputedStyle(element).width,
    ),
    '20px',
  );

  const inherited = page.locator('#packed-swatch-inherited');
  const fixed = page.locator('#packed-swatch-fixed');
  assert.equal(
    await inherited.evaluate(
      /** Read the initial provider size. */
      (element) => getComputedStyle(element).width,
    ),
    '16px',
  );
  await page.locator('#packed-swatch-toggle').click();
  assert.equal(
    await inherited.evaluate(
      /** Read the updated inherited size. */
      (element) => getComputedStyle(element).width,
    ),
    '24px',
  );
  assert.equal(
    await fixed.evaluate(
      /** Keep the instance size ahead of provider changes. */
      (element) => getComputedStyle(element).width,
    ),
    '18px',
  );
  assert.equal(await page.locator('#packed-swatch-mix [data-value]').count(), 3);
  assert.equal(
    await page.locator('#packed-swatch-mix').evaluate(
      /** Read the native element selected by the mix's public `as` prop. */
      (element) => element.tagName,
    ),
    'DIV',
  );
  const owned = page.locator('#packed-swatch-child');
  assert.equal(await owned.getAttribute('data-value'), 'transparent');
  assert.equal(await owned.locator('[data-value]').count(), 2);
}
