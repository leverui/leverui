import { expect, test, type Page } from '@playwright/test';

/** Verify machine-owned focus, completion, form value, and disabled state. */
async function verifiesPinInputBrowser({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-pin-input--contract');
  const root = page.getByTestId('pin-root');
  const first = page.getByTestId('pin-0');
  const second = page.getByTestId('pin-1');
  await expect(root).toHaveClass(/lui-pin-input__root/, { timeout: 30_000 });
  await expect(first).toHaveClass(/lui-pin-input__input/);
  await expect(page.getByTestId('pin-control')).toHaveClass(/lui-pin-input__control/);
  await first.fill('1');
  await expect(second).toBeFocused();
  await second.fill('2');
  await page.getByTestId('pin-2').fill('3');
  await page.getByTestId('pin-3').fill('4');
  await expect(page.getByTestId('pin-completed')).toHaveText('1234');
  await expect(page.locator('input[name="code"]')).toHaveValue('1234');
  await page.getByTestId('pin-toggle').click();
  await expect(first).toBeDisabled();
  await expect(second).toBeDisabled();
}

test('Pin Input enters a code and follows disabled state', verifiesPinInputBrowser);
