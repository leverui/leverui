import { expect, test, type Page } from '@playwright/test';

/** Keep custom tags, refs, keyboard activation, and recipe defaults reactive. */
async function verifiesComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-colorpicker-composition--reactive-defaults');
  const root = page.getByTestId('color-picker-composed-root');
  const trigger = page.getByTestId('color-picker-composed-trigger');
  const input = page.getByTestId('color-picker-composed-input');
  const providerInput = page.getByTestId('color-picker-composed-provider-input');
  await expect(input).toHaveValue('#EB5E41', { timeout: 30_000 });
  await expect(providerInput).toHaveValue('#336699');
  await expect(root).toHaveJSProperty('tagName', 'SECTION');
  await expect(root).toHaveAttribute('data-root-ref', 'attached');
  await expect(trigger).toHaveAttribute('data-trigger-ref', 'attached');
  await expect(trigger).toHaveClass(/leverui-color-picker__trigger/);
  const smallHeight = await input.evaluate(
    /** Read the initial input size before provider defaults change. */
    (element) => Number.parseFloat(getComputedStyle(element).height),
  );
  await page.getByRole('button', { name: 'Increase picker size' }).click();
  await expect(input).toHaveValue('#EB5E41');
  await expect(providerInput).toHaveValue('#336699');
  const largeHeight = await input.evaluate(
    /** Read the updated recipe size on the owned machine. */
    (element) => Number.parseFloat(getComputedStyle(element).height),
  );
  const providerHeight = await providerInput.evaluate(
    /** Read the same inherited recipe size on the external machine. */
    (element) => Number.parseFloat(getComputedStyle(element).height),
  );
  expect(largeHeight).toBeGreaterThan(smallHeight);
  expect(providerHeight).toBe(largeHeight);
  await trigger.focus();
  await page.keyboard.press('Space');
  await expect(page.getByTestId('color-picker-composed-content')).toBeVisible();
}

test('ColorPicker composes native elements and reactive provider defaults', verifiesComposition);
