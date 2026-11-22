import { expect, test, type Page } from '@playwright/test';

const stories = [
  'basic',
  'controlled',
  'controlled-visibility',
  'hook-form',
  'sizes',
  'strength-indicator',
] as const;

/** Check all six stories render a native password input. */
async function verifiesPasswordStories({ page }: { page: Page }): Promise<void> {
  for (const story of stories) {
    await page.goto(`/iframe.html?id=components-password-input--${story}`);
    await expect(page.locator('#storybook-root input[type="password"]').first()).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Toggle password visibility' }).first(),
    ).toBeVisible();
  }
}

/** Check visibility toggles without losing the native input value. */
async function verifiesPasswordVisibility({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-password-input--controlled-visibility');
  const input = page.locator('#storybook-root input');
  await expect(input).toHaveValue('secret');
  await expect(page.getByText('Password is hidden')).toBeVisible();
  await page.getByRole('button', { name: 'Toggle password visibility' }).click();
  await expect(input).toHaveAttribute('type', 'text');
  await expect(input).toHaveValue('secret');
  await expect(page.getByText('Password is visible')).toBeVisible();
}

/** Check controlled text, all four sizes, and Field label association. */
async function verifiesPasswordNativeBehavior({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-password-input--controlled');
  const controlled = page.locator('#storybook-root input');
  await controlled.fill('new secret');
  await expect(controlled).toHaveValue('new secret');

  await page.goto('/iframe.html?id=components-password-input--sizes');
  await expect(page.locator('#storybook-root input')).toHaveCount(4);
  await page.goto('/iframe.html?id=components-password-input--hook-form');
  await expect(page.locator('#storybook-root input[name="password"]')).toHaveAttribute(
    'type',
    'password',
  );
  await expect(page.getByText('Password')).toBeVisible();
}

/** Check the weak, medium, and high meter progression. */
async function verifiesPasswordStrength({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-password-input--strength-indicator');
  const input = page.locator('#storybook-root input');
  await input.fill('abc');
  await expect(page.getByText('Low')).toBeVisible();
  await expect(page.locator('#storybook-root [data-selected]')).toHaveCount(1);
  await input.fill('abc123');
  await expect(page.getByText('Medium')).toBeVisible();
  await expect(page.locator('#storybook-root [data-selected]')).toHaveCount(2);
  await input.fill('Abc123!xyz');
  await expect(page.getByText('High')).toBeVisible();
  await expect(page.locator('#storybook-root [data-selected]')).toHaveCount(4);
}

test('Password Input stories render', verifiesPasswordStories);
test('Password Input controls visibility', verifiesPasswordVisibility);
test('Password Input preserves native and Field behavior', verifiesPasswordNativeBehavior);
test('Password Strength Meter follows thresholds', verifiesPasswordStrength);
