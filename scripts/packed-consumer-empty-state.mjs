import assert from 'node:assert/strict';

/** Verify installed Empty State semantics, refs, and reactive recipe CSS. */
export async function verifyPackedEmptyState(page) {
  const root = page.locator('#packed-empty-state');
  const title = page.locator('#packed-empty-title');
  assert.equal(await root.getAttribute('data-empty-state-ref'), 'section');
  assert.equal(await root.getAttribute('role'), 'status');
  assert.equal(await root.getAttribute('size'), null);
  assert.equal(await title.getAttribute('data-empty-state-title-ref'), 'h2');
  assert.equal(await title.getAttribute('data-empty-state-title-parent-ref'), 'h2');
  assert.equal(await title.textContent(), 'No items');
  assert.equal(await page.locator('#packed-empty-description').textContent(), 'Add one to begin.');
  assert.equal(await page.locator('#packed-empty-action').textContent(), 'Add item');
  assert.match((await root.getAttribute('class')) ?? '', /leverui-empty-state__root/);
  assert.equal(
    await root.evaluate(
      /** Read the installed small-size vertical padding. */
      (element) => getComputedStyle(element).paddingTop,
    ),
    '24px',
  );
  await root.evaluate(
    /** Mark the original section before changing the provider size. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-empty-toggle').click();
  assert.equal(await root.getAttribute('data-original-node'), 'true');
  assert.equal(
    await root.evaluate(
      /** Read the installed large-size vertical padding. */
      (element) => getComputedStyle(element).paddingTop,
    ),
    '64px',
  );
}
