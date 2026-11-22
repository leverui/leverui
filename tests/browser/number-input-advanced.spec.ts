import { expect, test, type Locator, type Page } from '@playwright/test';
import { dragMouseTo } from './drag-with-movement';

/** Check that user edits reach the caller-owned Solid signal. */
async function verifiesControlledUpdates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-number-input-advanced--controlled');
  const input = page.getByTestId('controlled-input');
  await expect(input).toHaveValue('2');
  await page.getByTestId('controlled-increment').click();
  await expect(input).toHaveValue('3');
  await expect(page.getByTestId('controlled-value')).toHaveText('3');
  await expect(page.getByTestId('controlled-changes')).toHaveText('1');
  await input.fill('7');
  await expect(input).toHaveValue('7');
  await expect(page.getByTestId('controlled-value')).toHaveText('7');
  await expect(page.getByTestId('controlled-changes')).not.toHaveText('1');
}

/** Check Field state, labeling, descriptions, and reactive updates. */
async function verifiesFieldComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-number-input-advanced--field-composition');
  const input = page.getByTestId('field-number-input');
  await expect(input).toHaveAttribute('aria-roledescription', 'number field');
  await expect(input).toHaveAttribute('required', '');
  await expect(input).toHaveAttribute('aria-describedby', /helper-text/);
  await page.getByText('Field quantity').click();
  await expect(input).toBeFocused();
  await page.getByTestId('field-toggle').click();
  await expect(page.getByTestId('field-root')).toHaveAttribute('data-readonly', '');
  await expect(input).toHaveJSProperty('required', false);
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveJSProperty('readOnly', true);
  await expect(page.getByRole('button', { name: 'increment value' })).toBeDisabled();
  await expect(input).toHaveAttribute('aria-describedby', /error-text/);
  await expect(page.getByText('Quantity is invalid')).toBeVisible();
}

/** Select the formatted text and delete it; `fill` would append to it while focused. */
async function clearNumberField(input: Locator): Promise<void> {
  await input.focus();
  await input.press('ControlOrMeta+a');
  await input.press('Backspace');
}

/** Check formatting, blur clamping, wheel stepping, and scrubber interaction. */
async function verifiesMachineOptions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-number-input-advanced--machine-options');
  const input = page.getByTestId('options-input');
  await expect(input).toHaveValue('2.00');
  await clearNumberField(input);
  await input.pressSequentially('15.123');
  await page.getByTestId('options-blur').click();
  await expect(input).toHaveValue('10.00');
  await input.focus();
  await input.hover();
  await page.mouse.wheel(0, 1);
  await expect(input).toHaveValue('9.00');
  const scrubber = page.getByTestId('options-scrubber');
  const bounds = await scrubber.boundingBox();
  if (!bounds) throw new Error('Number Input scrubber has no browser bounds.');
  const from = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await dragMouseTo(page, from, { x: from.x + 40, y: from.y });
  await page.mouse.up();
  await expect(input).not.toHaveValue('9.00');
}

test('Number Input supports controlled updates', verifiesControlledUpdates);
test('Number Input composes with Field state', verifiesFieldComposition);
test('Number Input preserves machine options', verifiesMachineOptions);

/** Check normal uncontrolled edits after stepping. */
async function verifiesUncontrolledTyping({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-number-input-advanced--uncontrolled');
  const input = page.getByTestId('uncontrolled-input');
  await page.getByTestId('uncontrolled-increment').click();
  await expect(input).toHaveValue('4');
  await input.selectText();
  await input.press('6');
  await expect(input).toHaveValue('6');
  await expect(page.getByTestId('uncontrolled-value')).toHaveText('6');
}

test('Number Input accepts uncontrolled typing after stepping', verifiesUncontrolledTyping);

/** Check caller-rendered input editing on a normal client mount. */
async function verifiesChildInputTyping({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-number-input-advanced--child-input');
  const input = page.getByTestId('child-example-input');
  await page.getByTestId('child-example-increment').click();
  await expect(input).toHaveValue('4');
  await input.selectText();
  await input.press('6');
  await expect(input).toHaveValue('6');
  await expect(page.getByTestId('child-example-value')).toHaveText('6');
}

test('Number Input accepts typing through a caller-rendered input', verifiesChildInputTyping);
