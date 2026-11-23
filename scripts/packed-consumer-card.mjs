import assert from 'node:assert/strict';

/** Verify installed Card semantics, spacing, and reactive defaults. */
export async function verifyPackedCard(page) {
  const card = page.locator('#packed-card');
  assert.equal(await card.locator('h3').textContent(), 'Installed card');
  assert.equal(await card.locator('p').textContent(), 'Installed description');
  assert.match((await card.getAttribute('class')) ?? '', /lui-card/);
  assert.equal(await card.getAttribute('variant'), null);
  assert.equal(await card.getAttribute('size'), null);
  assert.equal(
    await card.locator('#packed-card-body').evaluate(
      /** Read the installed small Card spacing. */
      (element) => getComputedStyle(element).paddingTop,
    ),
    '16px',
  );
  await card.evaluate(
    /** Mark the mounted Card root before changing provider defaults. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-card-toggle').click();
  assert.equal(await card.getAttribute('data-original-node'), 'true');
  assert.equal(
    await card.locator('#packed-card-body').evaluate(
      /** Read the updated large Card spacing. */
      (element) => getComputedStyle(element).paddingTop,
    ),
    '28px',
  );

  const configured = page.locator('#packed-custom-card');
  assert.equal(await configured.getAttribute('data-lui-private-style-runtime'), null);
  assert.match(
    await configured.evaluate(
      /** Read the consumer CSS gradient. */
      (element) => getComputedStyle(element).backgroundImage,
    ),
    /linear-gradient/,
  );
  assert.equal(await configured.getAttribute('variant'), null);
  assert.equal(await configured.getAttribute('size'), null);
  assert.equal(
    await page.locator('#packed-custom-card-body').evaluate(
      /** Read the consumer CSS Card spacing. */
      (element) => getComputedStyle(element).paddingTop,
    ),
    '40px',
  );
  assert.equal(
    await page.locator('#packed-custom-card-title').evaluate(
      /** Read the consumer CSS title scale. */
      (element) => getComputedStyle(element).fontSize,
    ),
    '24px',
  );
  assert.equal(
    await page.locator('#packed-custom-override-body').evaluate(
      /** Confirm the neighboring native Card keeps its explicit size. */
      (element) => getComputedStyle(element).paddingTop,
    ),
    '16px',
  );
}
