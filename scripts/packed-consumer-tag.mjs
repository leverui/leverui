import assert from 'node:assert/strict';

/** Verify installed Tag parts, accessibility, CSS, and reactive variants. */
export async function verifyPackedTag(page) {
  const root = page.locator('#packed-tag');
  const label = page.locator('#packed-tag-label');
  const close = page.locator('#packed-tag-close');
  assert.equal(await root.getAttribute('data-packed-tag-ref'), 'div');
  assert.equal(await root.getAttribute('size'), null);
  assert.equal(
    await page.locator('#packed-tag-start').evaluate(
      /** Read the installed start element's semantic tag. */
      (element) => element.tagName,
    ),
    'SPAN',
  );
  assert.equal(await close.getAttribute('type'), 'button');
  assert.equal(await close.getAttribute('aria-label'), 'Close');
  assert.equal(
    await root.evaluate(
      /** Read the inherited small size. */
      (element) => getComputedStyle(element).paddingLeft,
    ),
    '6px',
  );
  await label.evaluate(
    /** Mark the label node before changing the provider. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-tag-toggle').click();
  assert.equal(await label.getAttribute('data-original-node'), 'true');
  assert.equal(
    await root.evaluate(
      /** Read the updated large size on the same root. */
      (element) => getComputedStyle(element).paddingLeft,
    ),
    '10px',
  );
  await close.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#packed-tag-closes').textContent(), '1');
  assert.equal(
    await page.locator('#packed-tag-css-label').evaluate(
      /** Read the consumer stylesheet's final label color. */
      (element) => getComputedStyle(element).color,
    ),
    'rgb(1, 2, 3)',
  );

  const action = page.locator('#packed-tag-action');
  assert.equal(await action.getAttribute('type'), 'button');
  await action.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#packed-tag-actions').textContent(), '1');
}
