import { expect, test, type Page } from '@playwright/test';

/** Verify image and Avatar examples retain Card semantics and layout. */
async function verifiesCardComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-card-composition--guide');
  const horizontal = page.getByTestId('card-horizontal');
  await expect(horizontal).toHaveCSS('flex-direction', 'row');
  await expect(horizontal).not.toHaveAttribute('data-lui-private-style-runtime');
  await expect(page.getByTestId('card-image')).toHaveAttribute('alt', 'Purple preview');
  await expect(page.getByTestId('card-image')).toHaveJSProperty('complete', true);
  await expect(horizontal.locator('h3')).toHaveText('Image card');
  await expect(horizontal.locator('p')).toHaveText('Content beside an image.');
  await expect(horizontal.getByRole('button', { name: 'Open' })).toBeVisible();

  const avatar = page.getByTestId('card-avatar');
  await expect(avatar).toHaveCSS('width', '320px');
  await expect(avatar.locator('h3')).toHaveText('Team member');
  await expect(avatar.locator('p')).toContainText('Ada Lovelace');
  await expect(page.getByTestId('card-avatar-root')).toHaveCSS('width', '36px');
  await expect(avatar.getByRole('button', { name: 'Approve' })).toBeVisible();
}

test('Card composes image and Avatar guide examples', verifiesCardComposition);

/** Verify a Card inside a form preserves labels, input, and submit behavior. */
async function verifiesCardForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-card-composition--guide');
  const form = page.getByTestId('card-form');
  await expect(form.locator('h3')).toHaveText('Profile');
  await form.getByRole('textbox', { name: 'Display name' }).fill('Ada Lovelace');
  await form.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.getByTestId('card-form-result')).toHaveText('Saved');
  await expect(form.getByRole('textbox', { name: 'Display name' })).toHaveValue('Ada Lovelace');
}

test('Card preserves native form composition', verifiesCardForm);
