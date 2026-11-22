import assert from 'node:assert/strict';

/** Verify installed Spacer expansion and native child identity in Chromium. */
export async function verifyPackedSpacer(page) {
  const spacer = page.locator('#packed-spacer');
  const peer = page.locator('#packed-spacer-peer');
  const child = page.locator('#packed-spacer-child');
  await spacer.waitFor({ state: 'visible' });
  assert.equal(await spacer.getAttribute('type'), 'button');
  assert.deepEqual(
    await peer.evaluate(
      /** Read the unconfigured Spacer's shipped base styles. */
      (element) => {
        const style = getComputedStyle(element);
        return {
          flexGrow: style.flexGrow,
          justifySelf: style.justifySelf,
          alignSelf: style.alignSelf,
        };
      },
    ),
    { flexGrow: '1', justifySelf: 'stretch', alignSelf: 'stretch' },
  );
  assert.equal(
    await spacer.evaluate(
      /** Read the button's explicit initial flex growth. */
      (element) => getComputedStyle(element).flexGrow,
    ),
    '1',
  );
  assert.equal(await spacer.getAttribute('css'), null);
  await child.evaluate(
    /** Mark the existing native child before the Solid update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await spacer.click();
  assert.equal(
    await spacer.evaluate(
      /** Read updated growth from the installed component. */
      (element) => getComputedStyle(element).flexGrow,
    ),
    '2',
  );
  assert.equal(await child.getAttribute('data-original-node'), 'true');
  const spacerBox = await spacer.boundingBox();
  const peerBox = await peer.boundingBox();
  assert.ok(spacerBox && peerBox && spacerBox.width > peerBox.width);
}
