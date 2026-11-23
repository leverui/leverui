import assert from 'node:assert/strict';

/** Verify Code styles and reactive defaults in the isolated installed app. */
export async function verifyPackedCode(page) {
  const code = page.locator('#packed-code-solid');
  assert.equal(await code.textContent(), 'npm run build');
  assert.equal(await code.getAttribute('title'), 'Build command');
  assert.match((await code.getAttribute('class')) ?? '', /lui-code/);
  assert.equal(await code.getAttribute('variant'), null);
  assert.equal(
    await code.evaluate(
      /** Read the installed solid blue palette from the browser. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
    'rgb(98, 84, 199)',
  );

  const inherited = page.locator('#packed-code-inherited');
  const fixed = page.locator('#packed-code-fixed');
  assert.match((await inherited.getAttribute('class')) ?? '', /provider-code/);
  assert.match((await fixed.getAttribute('class')) ?? '', /provider-code/);
  assert.match((await fixed.getAttribute('class')) ?? '', /fixed-code/);
  assert.equal(
    await inherited.evaluate(
      /** Read the inherited extra-small Code size. */
      (element) => getComputedStyle(element).minHeight,
    ),
    '16px',
  );
  await page.locator('#packed-code-toggle').click();
  assert.equal(
    await inherited.evaluate(
      /** Read the updated large Code size. */
      (element) => getComputedStyle(element).minHeight,
    ),
    '28px',
  );
  assert.equal(
    await fixed.evaluate(
      /** Verify explicit size stays fixed after the provider update. */
      (element) => getComputedStyle(element).minHeight,
    ),
    '20px',
  );

  const configured = page.locator('#packed-code-custom');
  assert.equal(
    await configured.evaluate(
      /** Read the consumer CSS class's new Code appearance. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
    'rgb(101, 69, 160)',
  );
  assert.equal(
    await configured.evaluate(
      /** Read the consumer CSS class's new Code height. */
      (element) => getComputedStyle(element).minHeight,
    ),
    '36px',
  );
  assert.equal(
    await page.locator('#packed-code-override').evaluate(
      /** Verify an ordinary Code size remains separate from the custom class. */
      (element) => getComputedStyle(element).minHeight,
    ),
    '20px',
  );
}
