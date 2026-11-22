import assert from 'node:assert/strict';
import { expect } from '@playwright/test';

/** Verify installed Radiomark state, refs, composition, and consumer CSS. */
export async function verifyPackedRadiomark(page) {
  const mark = page.locator('#packed-radiomark');
  const owned = page.locator('#packed-radiomark-owned');
  assert.equal(await mark.getAttribute('data-mark-ref'), 'span');
  assert.equal(await mark.getAttribute('data-checked'), null);
  assert.equal(await mark.locator('.dot').count(), 0);
  assert.equal(await owned.getAttribute('data-checked'), '');
  assert.equal(await owned.locator('.dot').count(), 1);
  await expect(mark).toHaveCSS('border-width', '3px');
  await mark.evaluate(
    /** Mark the installed span before a Solid update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.locator('#packed-radiomark-toggle').click();
  await expect(mark).toHaveAttribute('data-checked', '');
  await expect(mark).toHaveAttribute('data-disabled', '');
  await expect(mark.locator('.dot')).toHaveCount(1);
  await expect(mark).toHaveAttribute('data-original-node', 'true');
  await expect(mark).toHaveCSS('width', '24px');
}
