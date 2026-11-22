import { expect, test, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';

/** Verify explicit initial focus, persistent content, and custom restoration. */
async function verifiesFocusTrapOptions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-focus-trap-options--contract');
  const launcher = page.getByTestId('focus-options-launcher');
  const preferred = page.getByRole('textbox', { name: 'Preferred input' });
  const persistent = page.getByTestId('focus-persistent');
  const returnTarget = page.getByTestId('focus-return-target');
  await expect(launcher).toBeVisible({ timeout: 30_000 });
  await launcher.click();
  await expect(preferred).toBeFocused();
  await persistent.focus();
  await expect(persistent).toBeFocused();
  await page.getByTestId('focus-unrelated').focus();
  await expect(page.getByTestId('focus-unrelated')).not.toBeFocused();
  await page.getByRole('button', { name: 'End options trap' }).click();
  await expect(returnTarget).toBeFocused();
  await expect(launcher).not.toBeFocused();
}

test('Focus Trap forwards focus targets and persistent elements', verifiesFocusTrapOptions);

/** Verify false return-focus and fallback focus on an empty trap. */
async function verifiesFocusTrapFallback({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-focus-trap-options--contract');
  await page.getByTestId('focus-disable-return').click();
  await page.getByTestId('focus-options-launcher').click();
  await expect(page.getByRole('textbox', { name: 'Preferred input' })).toBeFocused();
  await page.getByRole('button', { name: 'End options trap' }).click();
  await expect(page.getByTestId('focus-return-target')).not.toBeFocused();
  await page.getByTestId('focus-fallback-launcher').click();
  await expect(page.getByTestId('focus-options-active')).toHaveText('fallback');
  await expect(page.getByTestId('focus-fallback-target')).toBeFocused();
}

test('Focus Trap honors disabled return focus and fallback focus', verifiesFocusTrapFallback);

/** Verify false initial focus opts out while leaving containment active. */
async function verifiesSkippedInitialFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-focus-trap-options--contract');
  const launcher = page.getByTestId('focus-skip-launcher');
  const root = page.getByTestId('focus-skip-root');
  const input = page.getByRole('textbox', { name: 'Skipped initial focus input' });
  const close = page.getByRole('button', { name: 'End skipped focus trap' });
  await expect(launcher).toBeVisible({ timeout: 30_000 });
  await launcher.focus();
  await launcher.press('Enter');
  await expect(root).toHaveAttribute('data-activated', 'true');
  await expect(launcher).toBeFocused();
  await expect(input).not.toBeFocused();
  await input.focus();
  await expect(input).toBeFocused();
  await page.getByTestId('focus-unrelated').focus();
  await expect(page.getByTestId('focus-unrelated')).not.toBeFocused();
  const focusInside = await root.evaluate(
    /** Check containment without assuming which inner control Zag chooses. */
    (element) => element.contains(element.ownerDocument.activeElement),
  );
  expect(focusInside).toBe(true);
  await input.focus();
  await pressBrowserTab(page);
  await expect(close).toBeFocused();
  await close.click();
  await expect(launcher).toBeFocused();
}

test('Focus Trap preserves the initial focus opt-out', verifiesSkippedInitialFocus);
