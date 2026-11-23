import assert from 'node:assert/strict';
import { expect } from '@playwright/test';

/** Verify the installed Checkmark's native SVG, glyphs, and reactive styles. */
export async function verifyPackedCheckmark(page) {
  const root = page.locator('#packed-checkmark');
  assert.equal(await root.getAttribute('data-checkmark-ref'), 'svg');
  assert.equal(await root.getAttribute('data-state'), 'unchecked');
  assert.equal(await root.getAttribute('role'), null);
  assert.equal(await root.locator('path, polyline').count(), 0);
  assert.match((await root.getAttribute('class')) ?? '', /lui-checkmark/);
  const child = page.locator('#packed-checkmark-child');
  assert.equal(await child.getAttribute('viewBox'), '0 0 32 32');
  assert.equal(await child.locator('polyline').count(), 1);
  assert.equal(await child.getAttribute('data-checkmark-parent-ref'), 'svg');
  assert.equal(await child.getAttribute('data-checkmark-child-ref'), 'svg');
  const span = page.locator('#packed-checkmark-span');
  assert.equal(await span.getAttribute('data-checkmark-span-ref'), 'span');
  assert.equal(
    await span.evaluate(/** Read the selected native tag. */ (element) => element.tagName),
    'SPAN',
  );

  await root.evaluate(
    /** Mark the first native node before changing state. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  const background = await root.evaluate(
    /** Capture the unchecked recipe background. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.locator('#packed-checkmark-cycle').click();
  await expect(root).toHaveAttribute('data-state', 'checked');
  await expect(root.locator('polyline')).toHaveCount(1);
  assert.notEqual(
    await root.evaluate(
      /** Read the checked palette background from installed CSS. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
    background,
  );
  await page.locator('#packed-checkmark-cycle').click();
  await expect(root).toHaveAttribute('data-state', 'indeterminate');
  await expect(root.locator('path')).toHaveAttribute('d', 'M5 12h14');
  assert.equal(await root.getAttribute('data-original-node'), 'true');
}
