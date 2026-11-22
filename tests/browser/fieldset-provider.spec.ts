import { expect, test, type Page } from '@playwright/test';

/** Verify a caller-owned accessor updates native and public context state. */
async function verifiesFieldsetProvider({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-fieldset-provider--contract');
  const root = page.getByTestId('provider-fieldset');
  const input = page.getByTestId('provider-input');
  const renderState = page.getByTestId('provider-render-state');
  const hookState = page.getByTestId('provider-hook-state');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-ref-received', 'root');
  await expect(page.getByTestId('provider-legend')).toHaveAttribute('data-ref-received', 'legend');
  await expect(root).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(input).toBeEnabled();
  await expect(renderState).toHaveText('false:false');
  await expect(hookState).toHaveText('false:false');

  await page.getByTestId('provider-toggle').click();
  await expect(root).toHaveAttribute('disabled', '');
  await expect(input).toBeDisabled();
  await expect(root).toHaveAttribute('aria-describedby', /error-text/);
  await expect(page.getByText('Provider error')).toBeVisible();
  await expect(renderState).toHaveText('true:true');
  await expect(hookState).toHaveText('true:true');

  await page.getByTestId('provider-toggle').click();
  await expect(root).not.toHaveAttribute('disabled', '');
  await expect(input).toBeEnabled();
  await expect(page.getByText('Provider error')).toHaveCount(0);
  await expect(root).not.toHaveAttribute('aria-describedby', /error-text/);
  await expect(root).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(renderState).toHaveText('false:false');
  await expect(hookState).toHaveText('false:false');
}

test(
  'caller-owned Fieldset preserves native controls and context transitions',
  verifiesFieldsetProvider,
);
