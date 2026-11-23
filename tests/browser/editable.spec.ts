import { expect, test, type Page } from '@playwright/test';
import { readEditableSubmitKey } from './editable-submit-key';

/** Verify native editing, controls, reactive styling, and consumer CSS. */
async function verifiesEditableBrowser({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-editable--contract');
  const root = page.getByTestId('editable-root');
  const preview = page.getByTestId('editable-preview');
  const input = page.getByTestId('editable-input');
  await expect(input).toHaveJSProperty('type', 'text', { timeout: 30_000 });
  await expect(root).toHaveClass(/leverui-editable__root/);
  await expect(root).toHaveCSS('display', 'inline-flex');
  await expect(preview).toHaveText('Click to edit');
  await page.getByTestId('editable-edit').click();
  await expect(input).toBeVisible();
  await input.fill('Updated name');
  await page.getByTestId('editable-submit').click();
  await expect(preview).toHaveText('Updated name');
  await page.getByTestId('editable-edit').click();
  await input.fill('Discard this');
  await page.getByTestId('editable-cancel').click();
  await expect(preview).toHaveText('Updated name');
  await page.addStyleTag({
    content: `[data-testid="editable-contract"] {
      --lui-colors-bg-muted: rgb(30, 40, 90);
      --lui-editable-gap: 11px;
      --lui-editable-padding-inline: 13px;
      --lui-editable-control-height: 48px;
    }`,
  });
  await preview.hover();
  await expect(preview).toHaveCSS('background-color', 'rgb(30, 40, 90)');
  await expect(preview).toHaveCSS('padding-left', '13px');
  await expect(preview).toHaveCSS('min-height', '48px');
  await expect(root).toHaveCSS('column-gap', '11px');
  await page.getByTestId('editable-toggle').click();
  await expect(input).toBeDisabled();
}

test('Editable commits, cancels, and updates its native input', verifiesEditableBrowser);

/** Confirm responsive authored CSS follows the root's finite size attributes. */
async function verifiesResponsiveEditable({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=components-editable--responsive');
  const root = page.getByTestId('responsive-editable-root');
  const preview = page.getByTestId('responsive-editable-preview');
  await expect(root).toHaveAttribute('data-size', 'sm');
  await expect(root).toHaveAttribute('data-size-md', 'lg');
  await expect(root).toHaveCSS('font-size', '14px');
  await expect(preview).toHaveCSS('min-height', '32px');
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(root).toHaveCSS('font-size', '16px');
  await expect(preview).toHaveCSS('min-height', '40px');
}

test('Editable size choices respond to CSS breakpoints', verifiesResponsiveEditable);

/** Verify controlled multiline editing through the native textarea. */
async function verifiesEditableTextarea({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-editable-textarea--controlled');
  const preview = page.getByTestId('multiline-preview');
  const textarea = page.getByTestId('multiline-input');
  await expect(textarea).toHaveJSProperty('tagName', 'TEXTAREA', { timeout: 30_000 });
  await expect(preview).toHaveText('Notes');
  await page.getByTestId('multiline-edit').click();
  await expect(textarea).toBeVisible();
  await textarea.fill('First line\nSecond line');
  await page.getByTestId('multiline-save').click();
  await expect(preview).toHaveText('First line Second line');
}

test('Editable keeps controlled textarea changes in sync', verifiesEditableTextarea);

/** Exercise preview focus activation and native input commit and revert keys. */
async function verifiesEditableKeyboard({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-editable--contract');
  const preview = page.getByTestId('editable-preview');
  const input = page.getByTestId('editable-input');
  const edit = page.getByTestId('editable-edit');

  await preview.focus();
  await expect(input).toBeFocused();
  await input.fill('Keyboard value');
  await input.press('Enter');
  await expect(preview).toHaveText('Keyboard value');
  await expect(edit).toBeFocused();

  await preview.focus();
  await expect(input).toBeFocused();
  await input.fill('Discarded value');
  await input.press('Escape');
  await expect(preview).toHaveText('Keyboard value');
  await expect(edit).toBeFocused();
}

test(
  'Editable preserves keyboard activation, commit, cancel, and focus return',
  verifiesEditableKeyboard,
);

/** Keep plain Enter multiline and reserve modified Enter for submission. */
async function verifiesTextareaKeyboard({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-editable-textarea--controlled');
  const textarea = page.getByTestId('multiline-input');
  const preview = page.getByTestId('multiline-preview');
  const edit = page.getByTestId('multiline-edit');
  await edit.click();
  await expect(textarea).toBeFocused();
  await textarea.fill('First line');
  await textarea.press('Enter');
  await expect(textarea).toBeVisible();
  await expect(textarea).toHaveValue('First line\n');
  await textarea.press(await readEditableSubmitKey(page));
  await expect(preview).toHaveText('First line');
  await expect(edit).toBeFocused();
}

test('Editable Textarea submits only on modified Enter', verifiesTextareaKeyboard);
