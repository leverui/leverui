import { expect, test, type Page } from '@playwright/test';

/** Verify native selection in the basic and controlled examples. */
async function verifiesNativeSelectValues({ page }: { page: Page }): Promise<void> {
  for (const story of ['basic', 'controlled']) {
    await page.goto(`/iframe.html?id=components-native-select--${story}`);
    const select = page.locator('#storybook-root select');
    await expect(select.locator('option')).toHaveText([
      'Select option',
      'React',
      'Vue',
      'Angular',
      'Svelte',
    ]);
    await select.selectOption('vue');
    await expect(select).toHaveValue('vue');
  }
}

/** Verify disabled and invalid state reaches the native select. */
async function verifiesNativeSelectStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-native-select--disabled');
  await expect(page.locator('#storybook-root select')).toBeDisabled();
  for (const story of ['invalid', 'invalid-root']) {
    await page.goto(`/iframe.html?id=components-native-select--${story}`);
    await expect(page.locator('#storybook-root select')).toHaveAttribute('data-invalid', '');
  }
  await page.goto('/iframe.html?id=components-native-select--invalid');
  await expect(page.getByText('Select an option to continue.')).toBeVisible();
}

/** Verify the form's required error and its recovery after choosing a value. */
async function verifiesNativeSelectForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-native-select--hook-form');
  await expect(page.getByLabel('Framework')).toBeVisible();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Framework is required')).toBeVisible();
  await expect(page.getByLabel('Framework')).toBeFocused();
  await page.getByLabel('Framework').selectOption('angular');
  await expect(page.getByText('Framework is required')).toHaveCount(0);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByLabel('Framework')).toHaveValue('angular');
}

/** Verify matrices and the user icon composition are complete. */
async function verifiesNativeSelectMatrices({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-native-select--sizes');
  await expect(page.locator('#storybook-root select')).toHaveCount(5);
  await page.goto('/iframe.html?id=components-native-select--variants');
  await expect(page.locator('#storybook-root select')).toHaveCount(3);
  await expect(page.locator('#storybook-root select option:first-child')).toHaveText([
    'variant (outline)',
    'variant (subtle)',
    'variant (plain)',
  ]);
  await page.goto('/iframe.html?id=components-native-select--input-group');
  await expect(page.locator('#storybook-root svg[aria-hidden="true"]')).toHaveCount(2);
  await expect(page.locator('#storybook-root svg.lucide-user')).toHaveCount(1);
  for (const width of [400, 600, 900, 1100, 1400, 1700]) {
    await page.setViewportSize({ width, height: 800 });
    const startPadding = await page.locator('#storybook-root select').evaluate(
      /** Read group-adjusted padding at each supported breakpoint. */
      (element) => Number.parseFloat(getComputedStyle(element).paddingInlineStart),
    );
    expect(startPadding).toBeGreaterThan(30);
  }
  await page.locator('#storybook-root select').selectOption('guest');
  await expect(page.locator('#storybook-root select')).toHaveValue('guest');
}

test('Native Select Basic and Controlled preserve values', verifiesNativeSelectValues);
test('Native Select Disabled and Invalid preserve native state', verifiesNativeSelectStates);
test('Native Select HookForm preserves required validation', verifiesNativeSelectForm);
test('Native Select matrices and InputGroup preserve compositions', verifiesNativeSelectMatrices);
