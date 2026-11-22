import { expect, test, type Page } from '@playwright/test';

/** Verify browser association, state changes, and computed Field recipe styles. */
async function verifiesFieldBrowser({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-field--contract');
  const input = page.getByTestId('field-input');
  const root = page.getByTestId('field-root');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText('Email', { exact: false })).toHaveAttribute('for', 'email');
  await expect(input).toHaveAttribute('required', '');
  await expect(input).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(root).toHaveCSS('flex-direction', 'column');
  await expect(page.getByText('Enter a valid address')).toHaveCount(0);
  await expect(page.getByTestId('readonly-input')).toHaveAttribute('readonly', '');
  await expect(page.getByTestId('disabled-input')).toBeDisabled();
  await input.focus();
  await expect(input).toBeFocused();
  await page.getByTestId('field-toggle').click();
  await expect(root).toHaveCSS('flex-direction', 'row');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAttribute('aria-describedby', /error-text/);
  await expect(page.getByText('Enter a valid address')).toBeVisible();
  await page.addStyleTag({
    content:
      '[data-testid="field-contract"] { --leverui-colors-fg-error: rgb(90, 30, 170); --leverui-field-label-width: 96px; }',
  });
  await expect(page.getByText('Enter a valid address')).toHaveCSS('color', 'rgb(90, 30, 170)');
  await expect(page.getByText('Email', { exact: false })).toHaveCSS('flex-basis', '96px');
}

test('Field composes styled parts and native input state in the browser', verifiesFieldBrowser);
