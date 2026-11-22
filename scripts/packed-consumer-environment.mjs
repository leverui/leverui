import assert from 'node:assert/strict';

/** Verify the installed provider and portal share the document root. */
export async function verifyPackedEnvironment(page) {
  const root = page.locator('#packed-environment-root');
  await root.waitFor();
  assert.equal(await root.textContent(), '#document');
  const portal = page.locator('#packed-environment-portal');
  await portal.waitFor();
  assert.equal(
    await portal.evaluate(
      /** Check the physical mount node in the independent browser app. */
      (element) => element.parentElement?.parentElement === document.body,
    ),
    true,
  );
}
