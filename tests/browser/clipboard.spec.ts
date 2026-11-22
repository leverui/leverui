import { enableBrowserClipboard } from './clipboard-test-setup';
import { expect, test, type Page } from '@playwright/test';

/** Copy the current value through the primitive's native button and inspect status. */
async function verifiesCopyAndReset({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=components-clipboard--basic');
  const root = page.getByTestId('clipboard-root');
  const input = page.getByTestId('clipboard-input');
  const trigger = page.getByTestId('clipboard-trigger');
  const indicator = page.getByTestId('clipboard-indicator');
  const copyText = page.getByTestId('clipboard-copy-text');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveClass(/leverui-clipboard__root/);
  await expect(input).toHaveValue('https://leverui.com');
  await expect(input).toHaveAttribute('readonly');
  await expect(page.getByTestId('clipboard-value')).toHaveText('https://leverui.com');
  await expect(trigger).toHaveAttribute('type', 'button');
  await expect(copyText).toHaveText('Copy');
  await expect(copyText).toHaveClass(/leverui-clipboard__copyText/);
  await expect(indicator.locator('rect')).toHaveCount(1);
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(copyText).toHaveText('Copied');
  await expect(indicator.locator('path')).toHaveAttribute('d', 'M20 6 9 17l-5-5');
  expect(
    await page.evaluate(
      /** Read the value written by the native Clipboard trigger. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe('https://leverui.com');
  await expect(copyText).toHaveText('Copy', { timeout: 5_000 });
  await expect(indicator.locator('rect')).toHaveCount(1);
}

test('Clipboard copies with keyboard and resets its status', verifiesCopyAndReset);

/** Keep a controlled value reactive without recreating the primitive's copy machine. */
async function verifiesControlledValue({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=components-clipboard--controlled');
  const value = page.getByTestId('clipboard-controlled-value');
  const input = page.getByTestId('clipboard-controlled-input');
  await expect(value).toHaveText('First value', { timeout: 30_000 });
  await expect(input).toHaveValue('First value');
  await page.getByRole('button', { name: 'Update Clipboard value' }).click();
  await expect(value).toHaveText('Second value');
  await expect(input).toHaveValue('Second value');
  await page.getByTestId('clipboard-controlled-trigger').click();
  expect(
    await page.evaluate(
      /** Confirm the controlled value reached the browser clipboard. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe('Second value');
}

test('Clipboard follows a controlled Solid value', verifiesControlledValue);

/** Apply reactive defaults without replacing a caller-owned Clipboard API. */
async function verifiesProviderDefaults({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-clipboard--provider');
  const owned = page.getByTestId('clipboard-owned-root');
  const provider = page.getByTestId('clipboard-provider-root');
  await expect(owned).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('clipboard-owned-value')).toHaveText('Provider default value');
  await expect(page.getByTestId('clipboard-provider-value')).toHaveText('Caller-owned value');
  await expect(owned).toHaveCSS('padding', '8px');
  await expect(provider).toHaveCSS('padding', '8px');
  await page.getByRole('button', { name: 'Increase Clipboard padding' }).click();
  await expect(owned).toHaveCSS('padding', '20px');
  await expect(provider).toHaveCSS('padding', '20px');
  await expect(page.getByTestId('clipboard-provider-value')).toHaveText('Caller-owned value');
}

test('Clipboard PropsProvider preserves caller-owned state', verifiesProviderDefaults);

/** Confirm ordinary consumer CSS overrides the default icon dimensions. */
async function verifiesConsumerOverride({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-clipboard--basic');
  const icon = page.getByTestId('clipboard-indicator').locator('svg');
  await expect(icon).toBeVisible({ timeout: 30_000 });
  await page.addStyleTag({
    content: '.leverui-clipboard__indicator svg { width: 28px; height: 28px; }',
  });
  await expect(icon).toHaveCSS('width', '28px');
  await expect(icon).toHaveCSS('height', '28px');
}

/** Keep copy behavior and part hooks when the root is unstyled. */
async function verifiesUnstyledCopy({ page }: { page: Page }): Promise<void> {
  await enableBrowserClipboard(page);
  await page.goto('/iframe.html?id=components-clipboard--unstyled');
  const root = page.getByTestId('clipboard-unstyled-root');
  const trigger = page.getByTestId('clipboard-unstyled-trigger');
  const indicator = page.getByTestId('clipboard-unstyled-indicator');
  await expect(root).toHaveAttribute('data-unstyled', '', { timeout: 30_000 });
  await expect(trigger).toHaveAttribute('data-unstyled', '');
  await expect(indicator).toHaveAttribute('data-unstyled', '');
  await trigger.click();
  expect(
    await page.evaluate(
      /** Read the value written by the unstyled trigger. */
      () => navigator.clipboard.readText(),
    ),
  ).toBe('Unstyled copy value');
}

test('Clipboard icon sizing accepts consumer CSS', verifiesConsumerOverride);
test('unstyled Clipboard retains native copying', verifiesUnstyledCopy);
