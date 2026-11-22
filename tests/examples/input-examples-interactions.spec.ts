import { expect, test, type Page } from '@playwright/test';

/** Open one curated Input story. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-input--${id}`);
}

/** Exercise the native character limit and caller-owned clear action. */
async function verifiesTextState({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'character-counter');
  await expect(page.getByText('0 / 20')).toBeVisible();
  await page.getByPlaceholder('Enter your message').fill('123456789012345678901');
  await expect(page.getByPlaceholder('Enter your message')).toHaveValue('12345678901234567890');
  await expect(page.getByText('20 / 20')).toBeVisible();

  await openStory(page, 'clear-button');
  const input = page.getByPlaceholder('Email');
  await expect(input).toHaveValue('mara@example.com');
  await page.getByRole('button').click();
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  await expect(page.getByRole('button')).toHaveCount(0);
}

/** Move the label with focus and entered text. */
async function verifiesFloatingLabel({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'floating-label');
  const input = page.locator('input');
  const label = page.getByText('Email');
  await expect(label).not.toHaveAttribute('data-float');
  await input.focus();
  await expect(label).toHaveAttribute('data-float');
  await input.fill('me@example.com');
  await input.press('Tab');
  await expect(label).toHaveAttribute('data-float');
  await input.fill('');
  await input.press('Tab');
  await expect(label).not.toHaveAttribute('data-float');
}

/** Check telephone masking and the payment formats. */
async function verifiesFormatting({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'mask');
  const phone = page.getByPlaceholder('(99) 99999-9999');
  await phone.fill('12345678901');
  await expect(phone).toHaveValue('(12) 34567-8901');

  await openStory(page, 'card-number');
  const number = page.getByPlaceholder('Card number');
  await number.fill('4242424242424242');
  await expect(number).toHaveValue('4242 4242 4242 4242');

  await openStory(page, 'card-details');
  await expect(page.locator('input')).toHaveCount(3);
  await page.getByPlaceholder('Card number').fill('4242424242424242');
  await expect(page.getByRole('img', { name: 'Visa' })).toBeVisible();
  await expect(page.getByPlaceholder('MM/YY')).toBeFocused();
  await page.getByPlaceholder('MM/YY').fill('1229');
  await expect(page.getByPlaceholder('MM/YY')).toHaveValue('12 / 29');
  await page.getByPlaceholder('CVV').fill('123');
  await expect(page.getByPlaceholder('CVV')).toHaveValue('123');
}

/** Verify domain choices and native form submission fields. */
async function verifiesFormAndSelect({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'select');
  const select = page.getByRole('combobox');
  await expect(select).toHaveValue('.com');
  await select.selectOption('.org');
  await expect(select).toHaveValue('.org');

  await openStory(page, 'hook-form');
  await page.getByRole('textbox', { name: 'First name' }).fill('Ada');
  await page.getByRole('textbox', { name: 'Last name' }).fill('Lovelace');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('textbox', { name: 'First name' })).toHaveValue('Ada');
  await expect(page.getByRole('textbox', { name: 'Last name' })).toHaveValue('Lovelace');
}

test('Input counter and clear control update', verifiesTextState);
test('Input floating label follows focus and value', verifiesFloatingLabel);
test('Input phone and payment formatting work', verifiesFormatting);
test('Input domain select and form work', verifiesFormAndSelect);
