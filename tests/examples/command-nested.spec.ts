import { expect, test } from '@playwright/test';

/** Verify issue field choices and breadcrumbs in the nested Command tree. */
test('nested Command updates issue fields and toggles labels in place', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--nested-pages');
  const trigger = page.getByRole('button', { name: 'Search actions...' });
  await trigger.click();
  let dialog = page.getByRole('dialog', { name: 'Command palette' });
  await expect(dialog.getByRole('option')).toHaveCount(8);
  await dialog.getByRole('option', { name: /Change status/ }).click();
  await expect(dialog.getByRole('option')).toHaveCount(6);
  await expect(dialog.getByRole('button', { name: 'Status' })).toBeVisible();
  await dialog.getByRole('option', { name: 'Done' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('Done', { exact: true })).toBeVisible();

  await trigger.click();
  dialog = page.getByRole('dialog', { name: 'Command palette' });
  await dialog.getByRole('option', { name: /Add labels/ }).click();
  await dialog.getByRole('option', { name: 'Feature' }).click();
  await expect(dialog).toBeVisible();
  await expect(page.getByText('Feature', { exact: true })).toHaveCount(2);
  await dialog.getByRole('button', { name: 'ENG-142' }).click();
  await expect(dialog.getByRole('option')).toHaveCount(8);
  await dialog.getByRole('option', { name: /Move to project/ }).click();
  await dialog.getByRole('option', { name: 'Engineering' }).click();
  await expect(dialog.getByRole('option')).toHaveCount(3);
  await dialog.getByRole('option', { name: 'Billing v2' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('Billing v2', { exact: true })).toBeVisible();
});

/** Verify deep search, back navigation, and the direct page shortcut. */
test('nested Command searches descendants and opens a page by shortcut', async ({ page }) => {
  await page.goto('/iframe.html?id=components-command--nested-pages');
  const trigger = page.getByRole('button', { name: 'Search actions...' });
  await trigger.click();
  let dialog = page.getByRole('dialog', { name: 'Command palette' });
  const input = dialog.getByRole('combobox');
  await input.fill('medium');
  await expect(dialog.getByRole('option', { name: /Medium/ })).toBeVisible();
  await dialog.getByRole('option', { name: /Medium/ }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('Medium', { exact: true })).toBeVisible();

  await page.keyboard.press('s');
  dialog = page.getByRole('dialog', { name: 'Command palette' });
  await expect(dialog.getByRole('button', { name: 'Status' })).toBeVisible();
  await expect(dialog.getByRole('option')).toHaveCount(6);
  await dialog.getByRole('combobox').press('Backspace');
  await expect(dialog.getByRole('option')).toHaveCount(8);
});

/** Verify a copy action reports success only after the clipboard contains the issue ID. */
test('nested Command copies the issue ID', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/iframe.html?id=components-command--nested-pages');
  await page.getByRole('button', { name: 'Search actions...' }).click();
  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  await dialog.getByRole('option', { name: /Copy issue ID/ }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('Copied ENG-142 to clipboard')).toBeVisible();
  const copied = await page.evaluate(
    /** Read the browser clipboard after the selected action settles. */
    () => navigator.clipboard.readText(),
  );
  expect(copied).toBe('ENG-142');
});
