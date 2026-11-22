import { expect, test, type Page } from '@playwright/test';

/** Verify native keyboard selection and reactive Field state in Chromium. */
async function verifiesNativeSelect({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-native-select--contract&viewMode=story');
  const select = page.getByRole('combobox', { name: 'Country', exact: true });
  const root = page.getByTestId('native-select-root');
  const indicator = page.getByTestId('native-select-indicator');
  await expect(select).toBeVisible({ timeout: 30_000 });
  await expect(select).toHaveAttribute('required', '');
  await expect(indicator).toHaveCSS('pointer-events', 'none');
  await select.focus();
  await page.keyboard.press('c');
  await expect(select).toHaveValue('ca');
  await expect(page.getByTestId('native-select-value')).toHaveText('ca');
  const originalElement = await select.elementHandle();
  await page.getByTestId('native-select-size').click();
  expect(
    await originalElement?.evaluate(
      /** Confirm the native control survives a reactive size change. */
      (element) => element.isConnected,
    ),
  ).toBe(true);
  await page.getByTestId('native-select-invalid').click();
  await expect(select).toHaveAttribute('aria-invalid', 'true');
  await expect(indicator).toHaveAttribute('data-invalid', '');
  await page.getByTestId('native-select-disable').click();
  await expect(select).toBeDisabled();
  await expect(indicator).toHaveAttribute('data-disabled', '');
  await expect(root).toHaveCSS('display', 'flex');
}

test('Native Select preserves native interaction and live Field state', verifiesNativeSelect);

/** Verify plain unlayered consumer CSS can override every public part hook. */
async function verifiesConsumerCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-native-select--contract&viewMode=story');
  const root = page.getByTestId('native-select-root');
  const select = page.getByRole('combobox', { name: 'Country', exact: true });
  const indicator = page.getByTestId('native-select-indicator');
  await expect(select).toBeVisible({ timeout: 30_000 });
  await page.addStyleTag({
    content: [
      '.leverui-native-select__root { width: 260px; }',
      '.leverui-native-select__field { border-color: rgb(255, 0, 0); }',
      '.leverui-native-select__indicator { color: rgb(0, 0, 255); }',
    ].join('\n'),
  });
  await expect(root).toHaveCSS('width', '260px');
  await expect(select).toHaveCSS('border-color', 'rgb(255, 0, 0)');
  await expect(indicator).toHaveCSS('color', 'rgb(0, 0, 255)');
}

test('Native Select exposes a stable consumer CSS hook', verifiesConsumerCss);

/** Verify responsive CSS and unstyled rendering through public root props. */
async function verifiesAppearanceContract({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 900 });
  await page.goto('/iframe.html?id=components-native-select--contract&viewMode=story');
  const responsive = page.getByRole('combobox', { name: 'Responsive country' });
  const unstyled = page.getByRole('combobox', { name: 'Unstyled country' });
  await expect(responsive).toHaveCSS('height', '32px');
  await expect(responsive).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.setViewportSize({ width: 900, height: 900 });
  await expect(responsive).toHaveCSS('height', '44px');
  await expect(responsive).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.getByTestId('native-select-unstyled')).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).toHaveCSS('appearance', 'auto');
}

test('Native Select applies responsive CSS and respects unstyled', verifiesAppearanceContract);
