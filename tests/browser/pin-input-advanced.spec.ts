import { expect, test, type Page } from '@playwright/test';

/** Paste formatted code through the available browser clipboard path. */
async function pasteFormattedCode(page: Page): Promise<void> {
  const first = page.getByTestId('options-pin-0');
  if (page.context().browser()?.browserType().name() === 'chromium') {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.evaluate(
      /** Put a formatted code onto the browser clipboard for a real paste. */
      () => navigator.clipboard.writeText('1-2-3-4'),
    );
    await first.press('ControlOrMeta+V');
    return;
  }

  await first.evaluate(
    /** Dispatch the same browser paste event where clipboard grants are unavailable. */
    (element) => {
      const clipboardData = new DataTransfer();
      clipboardData.setData('text/plain', '1-2-3-4');
      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData,
      });
      if (pasteEvent.clipboardData?.getData('text/plain') !== '1-2-3-4') {
        Object.defineProperty(pasteEvent, 'clipboardData', { value: clipboardData });
      }
      element.dispatchEvent(pasteEvent);
    },
  );
}

/** Check controlled callbacks, keyboard deletion, and focus movement. */
async function verifiesControlledPinInput({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pin-input-advanced--controlled');
  const first = page.getByTestId('controlled-pin-0');
  const second = page.getByTestId('controlled-pin-1');
  await first.fill('1');
  await expect(second).toBeFocused();
  await second.fill('2');
  await expect(page.getByTestId('controlled-code')).toHaveText('12');
  await expect(page.getByTestId('controlled-changes')).toHaveText('2');
  await second.focus();
  await second.press('Backspace');
  await expect(second).toHaveValue('');
  await expect(page.getByTestId('controlled-code')).toHaveText('1');
  await second.press('Backspace');
  await expect(first).toBeFocused();
}

test('controlled Pin Input updates and deletes with the keyboard', verifiesControlledPinInput);

/** Check masking, OTP metadata, label focus, rejected input, and pasted code. */
async function verifiesPinInputOptions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pin-input-advanced--machine-options');
  const first = page.getByTestId('options-pin-0');
  await expect(first).toHaveAttribute('type', 'password');
  await expect(first).toHaveAttribute('autocomplete', 'one-time-code');
  await page.getByTestId('options-label').click();
  await expect(first).toBeFocused();
  await first.press('x');
  await expect(page.getByTestId('options-invalid')).toHaveText('x');
  await pasteFormattedCode(page);
  await expect(page.locator('input[name="secret-code"]')).toHaveValue('1234');
  await expect(page.getByTestId('options-pin-3')).toHaveValue('4');
}

test('Pin Input masks OTP entry and sanitizes pasted code', verifiesPinInputOptions);

/** Verify Field state, label focus, descriptions, and native form attributes. */
async function verifiesPinInputField({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pin-input-advanced--field-composition');
  const first = page.getByTestId('field-pin-0');
  const second = page.getByTestId('field-pin-1');
  const hidden = page.getByTestId('field-pin-hidden');
  await expect(hidden).toHaveAttribute('required');
  await expect(first).not.toHaveAttribute('readonly');
  await expect(second).not.toHaveAttribute('readonly');
  await expect(page.getByTestId('field-pin-machine-readonly')).toHaveText('false');
  await expect(page.getByTestId('field-pin-help')).toBeVisible();
  await expect(page.getByTestId('field-pin-error')).toBeHidden();
  const hiddenId = await hidden.getAttribute('id');
  await expect(page.getByTestId('field-pin-label')).toHaveAttribute('for', hiddenId ?? '');
  await page.getByTestId('field-pin-label').click();
  await expect(first).toBeFocused();
  await page.getByTestId('field-pin-toggle').click();
  await expect(page.locator('[data-field-root]')).toHaveAttribute('data-readonly');
  await expect(page.getByTestId('field-pin-machine-readonly')).toHaveText('true');
  await expect(first).toHaveJSProperty('readOnly', true);
  await expect(first).toHaveAttribute('readonly');
  await expect(second).toHaveAttribute('readonly');
  await first.focus();
  await first.press('1');
  await expect(first).toHaveValue('');
  await expect(first).toHaveAttribute('aria-invalid', 'true');
  await expect(hidden).not.toHaveAttribute('required');
  await expect(page.getByTestId('field-pin-error')).toBeVisible();
  const describedBy = await hidden.getAttribute('aria-describedby');
  expect(describedBy).toContain(await page.getByTestId('field-pin-help').getAttribute('id'));
  expect(describedBy).toContain(await page.getByTestId('field-pin-error').getAttribute('id'));
  await page.getByTestId('field-pin-toggle').click();
  await expect(page.getByTestId('field-pin-machine-readonly')).toHaveText('false');
  await expect(first).not.toHaveAttribute('readonly');
  await expect(second).not.toHaveAttribute('readonly');
  await first.focus();
  await first.press('2');
  await expect(first).toHaveValue('2');
  await expect(hidden).toHaveValue('2');
}

test('Pin Input follows Field labels and validation states', verifiesPinInputField);

/** Verify the machine submits the owning native form on completion. */
async function verifiesPinInputAutoSubmit({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pin-input-advanced--auto-submit');
  await page.getByTestId('auto-pin-0').fill('1');
  await page.getByTestId('auto-pin-1').fill('2');
  await page.getByTestId('auto-pin-2').fill('3');
  await page.getByTestId('auto-pin-3').fill('4');
  await expect(page.getByTestId('auto-submissions')).toHaveText('1');
}

test('Pin Input auto submits after all fields are filled', verifiesPinInputAutoSubmit);
