import { expect, test, type Page } from '@playwright/test';

/** Format one number with the same Intl options as the public component. */
function number(locale: string, value: number, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/** Format the fixture's decimal data size through Intl unit formatting. */
function decimalByte(locale: string, value: number): string {
  return number(locale, Number((value / 1000).toPrecision(3)), {
    style: 'unit',
    unit: 'kilobyte',
    unitDisplay: 'short',
  });
}

/** Check reactive values, locale scopes, options, and fragment rendering. */
async function verifiesFormatContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-format--contract');
  const defaultNumber = page.getByTestId('format-number-default');
  const defaultByte = page.getByTestId('format-byte-default');
  await expect(defaultNumber).toHaveText(number('en-US', 1450.45));
  await expect(defaultNumber).toHaveJSProperty('childElementCount', 0);
  await expect(defaultByte).toHaveText(decimalByte('en-US', 1450.45));
  await expect(defaultByte).toHaveJSProperty('childElementCount', 0);
  await expect(page.getByTestId('format-number-currency')).toHaveText(
    number('en-US', 1450.45, { style: 'currency', currency: 'USD' }),
  );
  await expect(page.getByTestId('format-number-percent')).toHaveText(
    number('en-US', 0.25, { style: 'percent' }),
  );
  await expect(page.getByTestId('format-number-compact')).toHaveText(
    number('en-US', 1500000, { notation: 'compact', compactDisplay: 'short' }),
  );
  await expect(page.getByTestId('format-number-unit')).toHaveText(
    number('en-US', 384.4, { style: 'unit', unit: 'kilometer' }),
  );
  await expect(page.getByTestId('format-number-options')).toHaveText(
    number('en-US', 1.2345, { maximumFractionDigits: 1 }),
  );
  await expect(page.getByTestId('format-byte-binary')).toHaveText(
    number('en-US', 2, { style: 'unit', unit: 'kilobyte', unitDisplay: 'short' }),
  );
  await expect(page.getByTestId('format-byte-bit')).toHaveText(
    number('en-US', 1.45, { style: 'unit', unit: 'kilobit', unitDisplay: 'narrow' }),
  );
  await expect(page.getByTestId('format-byte-zero')).toHaveText('0 B');

  await page.getByTestId('format-locale-toggle').click();
  await expect(defaultNumber).toHaveText(number('de-DE', 1450.45));
  await expect(defaultByte).toHaveText(decimalByte('de-DE', 1450.45));
  await page.getByTestId('format-value-toggle').click();
  await expect(defaultNumber).toHaveText(number('de-DE', 2500.5));
  await expect(defaultByte).toHaveText(decimalByte('de-DE', 2500.5));
  await expect(page.getByTestId('format-number-currency')).toHaveText(
    number('de-DE', 2500.5, { style: 'currency', currency: 'USD' }),
  );
  await page.getByTestId('format-options-toggle').click();
  await expect(page.getByTestId('format-number-options')).toHaveText(
    number('de-DE', 1.2345, { maximumFractionDigits: 3 }),
  );
  await expect(page.getByTestId('format-byte-binary')).toHaveText(
    number('de-DE', 2, { style: 'unit', unit: 'kilobyte', unitDisplay: 'long' }),
  );
}

test('Format text tracks Intl options, locale, and value', verifiesFormatContract);
