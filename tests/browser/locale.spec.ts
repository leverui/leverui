import { expect, test, type Page } from '@playwright/test';

/** Verify default, nested, and reactive locale and filter contracts. */
async function verifiesLocaleScopes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=utilities-locale--scopes');
  const defaultProbe = page.getByTestId('locale-default');
  const outer = page.getByTestId('locale-outer');
  const primitive = page.getByTestId('locale-primitive');
  const nested = page.getByTestId('locale-nested');

  await expect(defaultProbe).toHaveAttribute('data-locale', 'en-US');
  await expect(defaultProbe).toHaveAttribute('data-dir', 'ltr');
  await expect(outer).toHaveAttribute('data-locale', 'en-US');
  await expect(outer).toHaveAttribute('data-dir', 'ltr');
  await expect(primitive).toHaveAttribute('data-locale', 'en-US');
  await expect(outer).toHaveAttribute('data-matches', 'false');
  await expect(outer).toHaveAttribute('data-starts', 'true');
  await expect(outer).toHaveAttribute('data-ends', 'true');
  await expect(outer).toHaveAttribute('data-contains', 'true');
  await expect(outer).toHaveAttribute('data-explicit-matches', 'true');
  await expect(nested).toHaveAttribute('data-locale', 'ar-EG');
  await expect(nested).toHaveAttribute('data-dir', 'rtl');

  await page.getByTestId('locale-arabic').click();
  await expect(outer).toHaveAttribute('data-locale', 'ar-EG');
  await expect(outer).toHaveAttribute('data-dir', 'rtl');
  await expect(primitive).toHaveAttribute('data-dir', 'rtl');
  await expect(outer).toHaveAttribute('data-explicit-matches', 'true');
  await expect(nested).toHaveAttribute('data-locale', 'ar-EG');

  await page.getByTestId('locale-turkish').click();
  await expect(outer).toHaveAttribute('data-locale', 'tr-TR');
  await expect(outer).toHaveAttribute('data-dir', 'ltr');
  await expect(primitive).toHaveAttribute('data-locale', 'tr-TR');
  await expect(outer).toHaveAttribute('data-matches', 'true');
  await expect(outer).toHaveAttribute('data-explicit-matches', 'true');
  await expect(nested).toHaveAttribute('data-locale', 'ar-EG');

  await page.getByTestId('locale-english').click();
  await expect(outer).toHaveAttribute('data-locale', 'en-US');
  await expect(outer).toHaveAttribute('data-matches', 'false');
  await expect(outer).toHaveAttribute('data-explicit-matches', 'true');
  await page.getByTestId('locale-sensitivity').click();
  await expect(outer).toHaveAttribute('data-starts', 'false');
  await expect(outer).toHaveAttribute('data-ends', 'false');
  await expect(outer).toHaveAttribute('data-contains', 'false');
  await page.getByTestId('locale-sensitivity').click();
  await expect(outer).toHaveAttribute('data-starts', 'true');
  await expect(outer).toHaveAttribute('data-ends', 'true');
  await expect(outer).toHaveAttribute('data-contains', 'true');
}

test('LocaleProvider shares reactive direction and filtering', verifiesLocaleScopes);
