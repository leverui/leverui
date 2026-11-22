import { expect, test, type Page } from '@playwright/test';

/** Exercise a native form and field using selected File Upload elements. */
async function verifiesFormComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-file-upload-behavior--form');
  const input = page.getByTestId('form-upload-input');
  await expect(input).toHaveAttribute('type', 'file', { timeout: 30_000 });
  await expect(input).toHaveAttribute('name', 'attachment');
  await expect(input).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(input).toHaveAttribute('aria-describedby', /error-text/);
  await expect(input).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByTestId('form-dropzone')).toHaveAttribute('data-invalid', '');
  await expect(input).toHaveAttribute('required', '');
  await expect(page.getByTestId('selected-refs')).toContainText('root:SECTION');
  await expect(page.getByTestId('selected-refs')).toContainText('dropzone:ARTICLE');
  await expect(page.getByTestId('form-dropzone')).toHaveAttribute('data-file-upload-dropzone');
  await page.getByTestId('form-dropzone').hover();
  await expect(page.getByTestId('selected-refs')).toContainText('root:hover');
  await expect(page.getByTestId('selected-refs')).toContainText('dropzone:hover');
  const label = page.getByTestId('form-upload-label');
  const inputId = await input.getAttribute('id');
  await expect(label).toHaveAttribute('for', inputId ?? '');
  await input.setInputFiles({
    name: 'report.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('ok'),
  });
  await page.getByRole('button', { name: 'Submit attachment' }).click();
  await expect(page.getByTestId('form-result')).toHaveText('report.txt');
  // Zag 2 submits a read-only upload's files, so read-only marks the parts
  // instead of disabling the input; only disabled leaves it out of the form.
  await page.getByTestId('toggle-readonly').click();
  await expect(input).toBeEnabled();
  await expect(page.getByTestId('form-trigger')).toHaveAttribute('data-readonly');
  await page.getByTestId('toggle-default-disabled').click();
  await expect(input).toBeDisabled();
  await expect(page.getByTestId('form-trigger')).toBeDisabled();
  await page.getByTestId('toggle-default-disabled').click();
  await expect(input).toBeEnabled();
  await page.getByTestId('toggle-readonly').click();
  await expect(input).toBeEnabled();
  await expect(page.getByTestId('form-trigger')).not.toHaveAttribute('data-readonly');
}

/** Check that the label and keyboard trigger open the browser file chooser. */
async function verifiesPickerActivation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-file-upload-behavior--form');
  await expect(page.getByTestId('form-upload-input')).toHaveAttribute('type', 'file', {
    timeout: 30_000,
  });
  const labelChooser = page.waitForEvent('filechooser');
  await page.getByTestId('form-upload-label').click();
  expect(await labelChooser).toBeTruthy();
  await page.getByTestId('form-trigger').focus();
  const triggerChooser = page.waitForEvent('filechooser');
  await page.keyboard.press('Enter');
  expect(await triggerChooser).toBeTruthy();
  await page.getByTestId('form-dropzone').focus();
  const dropzoneChooser = page.waitForEvent('filechooser');
  await page.keyboard.press('Enter');
  expect(await dropzoneChooser).toBeTruthy();
}

test('File Upload participates in a native form and Field', verifiesFormComposition);
test(
  'File Upload label, trigger, and dropzone activate by pointer or keyboard',
  verifiesPickerActivation,
);
