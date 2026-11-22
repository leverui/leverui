import assert from 'node:assert/strict';

/** Verify Code Block styling, copy, collapse, and reactive source in the installed app. */
export async function verifyPackedCodeBlock(page) {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  const root = page.locator('#packed-code-block');
  const content = root.locator('.leverui-code-block__content');
  const code = page.locator('#packed-code-block-code');
  const collapse = page.locator('#packed-code-block-collapse');
  assert.match((await root.getAttribute('class')) ?? '', /leverui-code-block__root/);
  assert.equal(await root.getAttribute('size'), null);
  const inheritedRoot = page.locator('section#packed-code-block-provider');
  assert.equal(await inheritedRoot.count(), 1);
  assert.equal(await inheritedRoot.getAttribute('title'), 'Packed shared code');
  assert.match((await inheritedRoot.getAttribute('class')) ?? '', /packed-code-block-provider/);
  assert.equal(await inheritedRoot.getAttribute('as'), null);
  assert.equal(
    await inheritedRoot.evaluate(
      /** Read an inherited provider CSS value from the installed package. */
      (element) => getComputedStyle(element).borderTopWidth,
    ),
    '3px',
  );
  const localRoot = page.locator('div#packed-code-block-provider-override');
  assert.equal(await localRoot.count(), 1);
  assert.equal(await localRoot.getAttribute('title'), 'Packed shared code');
  assert.match((await localRoot.getAttribute('class')) ?? '', /packed-code-block-provider/);
  assert.match((await localRoot.getAttribute('class')) ?? '', /packed-code-block-local/);
  assert.equal(await localRoot.getAttribute('as'), null);
  assert.equal(await code.textContent(), 'first\nsecond');
  assert.equal(await code.getAttribute('data-plaintext'), '');
  assert.equal(await content.getAttribute('aria-expanded'), 'false');
  assert.equal(await collapse.getAttribute('aria-controls'), await content.getAttribute('id'));
  assert.equal(
    await root.evaluate(
      /** Read the consumer's CSS variable override. */
      (element) => getComputedStyle(element).borderRadius,
    ),
    '12px',
  );
  await code.evaluate(
    /** Mark the native node before a source update. */
    (element) => element.setAttribute('data-packed-node', 'true'),
  );
  await page.locator('#packed-code-block-toggle').click();
  assert.equal(await code.textContent(), 'first\nsecond\nthird');
  assert.equal(await code.getAttribute('data-packed-node'), 'true');
  await collapse.click();
  assert.equal(await content.getAttribute('aria-expanded'), 'true');
  await page.locator('#packed-code-block-copy').click();
  assert.equal(
    await page.evaluate(
      /** Read the copied live source from Chromium's clipboard. */
      () => navigator.clipboard.readText(),
    ),
    'first\nsecond\nthird',
  );
}
