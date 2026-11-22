import assert from 'node:assert/strict';
import { expect } from '@playwright/test';

/** Require an installed component's generated ID before comparing ARIA links. */
async function requiredAttribute(locator, name) {
  const value = await locator.getAttribute(name);
  assert.ok(value, `Packed interaction is missing ${name}.`);
  return value;
}

/** Verify native editing and reset through the installed Input export. */
async function verifyInput(page) {
  const input = page.getByTestId('packed-input');
  await expect(input).toHaveValue('draft');
  await expect(input).toHaveJSProperty('defaultValue', 'draft');
  await input.fill('edited');
  await expect(input).toHaveValue('edited');
  await page.getByTestId('packed-input-reset').click();
  await expect(input).toHaveValue('draft');
}

/** Verify label activation, controlled state, and native form data. */
async function verifyCheckbox(page) {
  const input = page.getByTestId('packed-checkbox-input');
  const root = page.getByTestId('packed-checkbox-root');
  await expect(input).not.toBeChecked();
  await root.getByText('Packed consent').click();
  await expect(input).toBeFocused();
  await expect(input).toBeChecked();
  await expect(root).toHaveAttribute('data-state', 'checked');
  const entries = await page.getByTestId('packed-checkbox-form').evaluate(
    /** Read the browser's submitted values rather than component state. */
    (form) => Array.from(new FormData(form).entries()),
  );
  assert.deepEqual(entries, [['packed-choice', 'yes']]);
}

/** Verify a controlled installed Dialog's focus and portalled parts. */
async function verifyDialog(page) {
  const trigger = page.getByTestId('packed-dialog-trigger');
  const content = page.getByTestId('packed-dialog-content');
  await expect(content).toHaveCount(0);
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(page.getByTestId('packed-dialog-input')).toBeFocused();
  const contentId = await requiredAttribute(content, 'id');
  const titleId = await requiredAttribute(content, 'aria-labelledby');
  const descriptionId = await requiredAttribute(content, 'aria-describedby');
  await expect(trigger).toHaveAttribute('aria-controls', contentId);
  await expect(page.locator(`[id="${titleId}"]`)).toHaveText('Packed dialog');
  await expect(page.locator(`[id="${descriptionId}"]`)).toHaveText('Installed portal and focus');
  await expect(page.locator('#app').getByTestId('packed-dialog-content')).toHaveCount(0);
  await page.getByTestId('packed-dialog-close').click();
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
}

/** Exercise the additional interaction patterns in the installed Solid app. */
export async function verifyPackedInteractions(page) {
  await verifyInput(page);
  await verifyCheckbox(page);
  await verifyDialog(page);
}
