import assert from 'node:assert/strict';

/** Read a native Stack's computed flex direction in the browser. */
function computedDirection(node) {
  return getComputedStyle(node).flexDirection;
}

/** Read the separator's computed top margin in the browser. */
function computedMarginTop(node) {
  return getComputedStyle(node).marginTop;
}

/** Read the separator's computed left margin in the browser. */
function computedMarginLeft(node) {
  return getComputedStyle(node).marginLeft;
}

/** Read the consumer-colored separator's computed border color. */
function computedBorderColor(node) {
  return getComputedStyle(node).borderColor;
}

/** Verify installed Stack layout, separators, wrappers, and live child identity. */
export async function verifyPackedStack(page) {
  const root = page.locator('#packed-stack');
  const first = page.locator('#packed-stack-first');
  const last = page.locator('#packed-stack-last');
  const lines = root.locator('.lui-stack-separator');
  await root.waitFor({ state: 'visible' });
  assert.deepEqual(
    await first.evaluate(
      /** Confirm the consumer CSS sizes Box without an inline style. */
      (element) => {
        const style = getComputedStyle(element);
        return [style.width, style.height, element.hasAttribute('style')];
      },
    ),
    ['20px', '20px', false],
  );
  assert.equal(await root.evaluate(computedDirection), 'column');
  assert.equal(await lines.count(), 1);
  assert.equal(await lines.first().evaluate(computedMarginTop), '8px');
  assert.equal(await page.locator('#packed-hstack').evaluate(computedDirection), 'row');
  assert.equal(await page.locator('#packed-vstack').evaluate(computedDirection), 'column');
  assert.equal(
    await page.locator('#packed-stack-colored-line').evaluate(computedBorderColor),
    'rgb(239, 68, 68)',
  );
  await first.evaluate(
    /** Mark the first native element before live layout changes. */
    (node) => {
      node.dataset.originalNode = 'true';
    },
  );
  await last.evaluate(
    /** Mark the last native element before live list changes. */
    (node) => {
      node.dataset.originalNode = 'true';
    },
  );
  await page.locator('#packed-stack-direction').click();
  assert.equal(await root.evaluate(computedDirection), 'row');
  assert.equal(await lines.first().evaluate(computedMarginLeft), '16px');
  await page.locator('#packed-stack-extra-toggle').click();
  await page.locator('#packed-stack-extra').waitFor({ state: 'visible' });
  assert.equal(await lines.count(), 2);
  assert.equal(await first.getAttribute('data-original-node'), 'true');
  assert.equal(await last.getAttribute('data-original-node'), 'true');
}
