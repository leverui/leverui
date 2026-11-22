import { expect, test, type Page } from '@playwright/test';
import { selectGuideFormValue } from './select-guide-form-value';
import { expectSelectGuidePlacement, moveSelectGuideOverlay } from './select-guide-placement';

/** Verify Dialog keeps its nested Select popup and form inside the modal. */
async function verifiesDialogSelect({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 900 });
  await page.goto('/iframe.html?id=components-select-guide-overlays--contract');
  await page.getByTestId('select-dialog-open').click();
  const dialog = page.getByTestId('select-dialog-content');
  await expect(dialog).toBeVisible({ timeout: 30_000 });
  const trigger = dialog.getByTestId('select-dialog-trigger');
  await trigger.focus();
  await trigger.press('ArrowDown');
  const listbox = dialog.getByTestId('select-dialog-listbox');
  await expect(listbox).toBeVisible();
  const positioner = dialog.getByTestId('select-dialog-positioner');
  await expectSelectGuidePlacement(trigger, positioner, dialog);
  await page.setViewportSize({ width: 900, height: 900 });
  await expectSelectGuidePlacement(trigger, positioner, dialog);
  await moveSelectGuideOverlay(dialog);
  await expectSelectGuidePlacement(trigger, positioner, dialog);
  await listbox.press('ArrowDown');
  await listbox.press('Enter');
  await expect(trigger).toContainText('SolidJS');
  expect(
    await dialog.getByTestId('select-dialog-form').evaluate(selectGuideFormValue, 'framework'),
  ).toBe('solid');
  await expect(dialog).toBeVisible();
  await trigger.press('ArrowDown');
  await expect(listbox).toBeVisible();
  await listbox.press('Escape');
  await expect(listbox).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByTestId('select-dialog-open')).toBeFocused();
}

test('Select works inside a Dialog without a nested portal', verifiesDialogSelect);

/** Verify Popover keeps its nested Select popup and selected form value. */
async function verifiesPopoverSelect({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 900 });
  await page.goto('/iframe.html?id=components-select-guide-overlays--contract');
  await page.getByTestId('select-popover-open').click();
  const popover = page.getByTestId('select-popover-content');
  await expect(popover).toBeVisible({ timeout: 30_000 });
  const trigger = popover.getByTestId('select-popover-trigger');
  await trigger.focus();
  await trigger.press('ArrowDown');
  const listbox = popover.getByTestId('select-popover-listbox');
  await expect(listbox).toBeVisible();
  const positioner = popover.getByTestId('select-popover-positioner');
  await expectSelectGuidePlacement(trigger, positioner, popover);
  await page.setViewportSize({ width: 900, height: 900 });
  await expectSelectGuidePlacement(trigger, positioner, popover);
  await moveSelectGuideOverlay(popover);
  await expectSelectGuidePlacement(trigger, positioner, popover);
  await listbox.press('ArrowDown');
  await listbox.press('ArrowDown');
  await listbox.press('Enter');
  await expect(trigger).toContainText('Vue.js');
  expect(
    await popover.getByTestId('select-popover-form').evaluate(selectGuideFormValue, 'framework'),
  ).toBe('vue');
  await expect(popover).toBeVisible();
  await trigger.press('ArrowDown');
  await expect(listbox).toBeVisible();
  await listbox.press('Escape');
  await expect(listbox).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(popover).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(popover).not.toBeVisible();
  await expect(page.getByTestId('select-popover-open')).toBeFocused();
}

test('Select works inside a Popover without a nested portal', verifiesPopoverSelect);
