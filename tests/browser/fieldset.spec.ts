import { expect, test, type Page } from '@playwright/test';

/** Verify browser grouping, associations, responsive state, and CSS overrides. */
async function verifiesFieldsetBrowser({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-fieldset--contract');
  const root = page.getByTestId('fieldset-root');
  const legend = page.getByTestId('fieldset-legend');
  const input = page.getByTestId('fieldset-input');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveCSS('display', 'flex');
  await expect(root).toHaveCSS('flex-direction', 'column');
  await expect(root).toHaveAttribute('aria-labelledby', /fieldset::profile-group::legend/);
  await expect(root).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(page.getByText('Check your profile')).toHaveCount(0);
  await expect(page.getByTestId('fieldset-content')).toHaveClass(/lui-fieldset__content/);
  await expect(legend).toHaveCSS('font-size', '14px');
  await page.getByTestId('fieldset-toggle').click();
  await expect(root).toHaveAttribute('disabled', '');
  await expect(input).toBeDisabled();
  await expect(root).toHaveAttribute('data-invalid', '');
  await expect(root).toHaveAttribute('aria-describedby', /error-text/);
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(legend).toHaveCSS('font-size', '16px');
  const error = page.getByText('Check your profile');
  await expect(error).toBeVisible();
  await page.addStyleTag({
    content: '[data-testid="fieldset-contract"] { --lui-colors-fg-error: rgb(90, 30, 170); }',
  });
  await expect(error).toHaveCSS('color', 'rgb(90, 30, 170)');
}

test('Fieldset groups controls and updates visible native state', verifiesFieldsetBrowser);

/** Verify unlayered consumer CSS can customize root spacing and visible parts. */
async function verifiesFieldsetOverrides({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-fieldset--contract');
  const root = page.getByTestId('fieldset-root');
  const legend = page.getByTestId('fieldset-legend');
  const helper = page.getByText('Enter your name');
  const content = page.getByTestId('fieldset-content');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await page.addStyleTag({
    content: `[data-testid='fieldset-root'] {
      --lui-fieldset-space-y: 31px;
      --lui-fieldset-content-gap: 23px;
      --lui-fieldset-legend-size: 19px;
    }
    .lui-fieldset__helperText { color: rgb(31, 62, 93); }`,
  });
  await expect(helper).toHaveCSS('margin-top', '31px');
  await expect(content).toHaveCSS('gap', '23px');
  await expect(legend).toHaveCSS('font-size', '19px');
  await expect(helper).toHaveCSS('color', 'rgb(31, 62, 93)');
}

test('consumer CSS overrides Fieldset public hooks', verifiesFieldsetOverrides);
