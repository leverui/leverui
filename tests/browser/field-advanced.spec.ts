import { expect, test, type Page } from '@playwright/test';

/** Verify target labels, reactive defaults, and the external root observer. */
async function verifiesAdvancedField({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-field-advanced--contract');
  const amount = page.getByTestId('amount-input');
  const currency = page.getByTestId('currency-input');
  const provider = page.getByTestId('provider-input');
  const external = page.getByTestId('external-input');
  await expect(amount).toBeVisible({ timeout: 30_000 });
  await expect(currency).toHaveAttribute('id', 'field::price::item::currency');
  await expect(amount).toHaveAttribute('id', 'field::price::item::amount');
  await expect(page.getByText('Price', { exact: true })).toHaveAttribute(
    'for',
    'field::price::item::amount',
  );
  await page.getByText('Price', { exact: true }).click();
  await expect(amount).toBeFocused();
  await amount.fill('42');
  await expect(amount).toHaveValue('42');

  await expect(provider).not.toHaveAttribute('required', '');
  await expect(page.getByText('Optional')).toBeVisible();
  await expect(page.getByText('Provider error')).toHaveCount(0);
  await expect(external).toHaveAttribute('aria-describedby', /helper-text/);
  await page.getByTestId('advanced-toggle').click();
  await expect(provider).toHaveAttribute('required', '');
  await expect(provider).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Optional')).toHaveCount(0);
  await expect(page.getByText('Provider error')).toBeVisible();
  await expect(external).toHaveAttribute('aria-invalid', 'true');
  await expect(external).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(external).toHaveAttribute('aria-describedby', /error-text/);
  await expect(page.getByText('External error')).toBeVisible();
}

test('Field target, defaults, and external root retain accessible behavior', verifiesAdvancedField);
