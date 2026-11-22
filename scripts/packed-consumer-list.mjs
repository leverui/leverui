import assert from 'node:assert/strict';

/** Read final browser layout for one installed List element. */
function computedDisplay(element) {
  return getComputedStyle(element).display;
}

/** Read final browser color for one installed List item. */
function computedColor(element) {
  return getComputedStyle(element).color;
}

/** Verify packaged List semantics, CSS layers, and provider updates. */
export async function verifyPackedList(page) {
  const root = page.locator('#packed-list-default');
  const item = page.locator('#packed-list-item');
  assert.equal(await root.evaluate(computedDisplay), 'flex');
  assert.equal(await root.getAttribute('role'), 'list');
  assert.equal(await item.evaluate(computedDisplay), 'list-item');
  const childRoot = page.locator('#packed-child-root');
  const childItem = page.locator('#packed-child-item');
  assert.equal(await childRoot.getAttribute('role'), 'list');
  assert.equal(await childRoot.getAttribute('start'), '4');
  assert.equal(await childRoot.getAttribute('title'), 'Packed owned tasks');
  assert.equal(await childRoot.getAttribute('data-packed-root-ref'), 'received');
  assert.match((await childRoot.getAttribute('class')) ?? '', /packed-child-root/);
  assert.match((await childRoot.getAttribute('class')) ?? '', /leverui-list__root/);
  assert.equal(await childItem.textContent(), 'Owned item');
  assert.equal(await childItem.getAttribute('data-packed-item-ref'), 'received');
  assert.match((await childItem.getAttribute('class')) ?? '', /packed-child-item/);
  assert.match((await childItem.getAttribute('class')) ?? '', /leverui-list__item/);
  assert.equal(await childItem.evaluate(computedDisplay), 'list-item');
  assert.equal(
    await page.locator('#packed-list-ordered').evaluate(
      /** Identify the selected native ordered-list element. */
      (element) => element.tagName,
    ),
    'OL',
  );
  assert.equal(await page.locator('#packed-list-ordered').getAttribute('start'), '3');
  assert.equal(await page.locator('#packed-list-plain-item').evaluate(computedDisplay), 'flex');
  const indicator = page.locator('#packed-list-indicator');
  assert.equal(
    await indicator.evaluate(
      /** Read the consumer-owned icon element name. */
      (element) => element.tagName,
    ),
    'svg',
  );
  assert.equal(await indicator.getAttribute('role'), 'img');
  assert.equal(await indicator.getAttribute('aria-label'), 'Complete');
  assert.equal(await indicator.getAttribute('data-packed-ref'), 'received');
  assert.equal(await indicator.getAttribute('data-packed-child-ref'), 'received');
  assert.match((await indicator.getAttribute('class')) ?? '', /packed-list-icon/);
  assert.match((await indicator.getAttribute('class')) ?? '', /leverui-list__indicator/);
  await indicator.click();
  assert.equal(await indicator.getAttribute('data-packed-clicked'), 'true');
  for (const id of ['packed-list-bare-icon', 'packed-list-class-icon']) {
    assert.equal(
      await page.locator(`#${id}`).evaluate(
        /** Verify each consumer-selected icon is an SVG. */
        (element) => element.tagName,
      ),
      'svg',
    );
  }
  assert.match(
    (await page.locator('#packed-list-class-icon').getAttribute('class')) ?? '',
    /packed-class-icon/,
  );
  assert.equal(
    await page.locator('#packed-list-html-indicator').evaluate(
      /** Confirm a non-SVG child still receives the indicator contract. */
      (element) => element.tagName,
    ),
    'STRONG',
  );
  assert.match(
    (await page.locator('#packed-list-html-indicator').getAttribute('class')) ?? '',
    /packed-list-text/,
  );
  assert.equal(await page.locator('#packed-list-css-item').evaluate(computedColor), 'rgb(9, 8, 7)');

  await root.evaluate(
    /** Mark the installed root before its inherited variant changes. */
    (element) => element.setAttribute('data-original-list', 'true'),
  );
  await childRoot.evaluate(
    /** Mark the installed child root before provider variants change. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await childItem.evaluate(
    /** Mark the installed child item before provider variants change. */
    (element) => element.setAttribute('data-original-item', 'true'),
  );
  await page.locator('#packed-list-toggle').click();
  assert.equal(await root.getAttribute('data-original-list'), 'true');
  assert.equal(await item.evaluate(computedDisplay), 'flex');
  assert.equal(await childRoot.getAttribute('data-original-root'), 'true');
  assert.equal(await childItem.getAttribute('data-original-item'), 'true');
  assert.equal(await childItem.evaluate(computedDisplay), 'flex');
  assert.equal(
    await page.locator('#packed-list-ordered-item').evaluate(computedDisplay),
    'list-item',
  );
}
