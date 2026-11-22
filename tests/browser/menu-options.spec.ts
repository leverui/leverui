import { expect, test, type Page } from '@playwright/test';

/** Verify controlled checkbox and radio selection on one mounted menu. */
async function verifiesMenuOptions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-menu-options--contract');
  await page.getByTestId('menu-options-trigger').click();
  await expect(page.getByTestId('menu-options-content')).toBeVisible();
  const checkbox = page.getByTestId('menu-checkbox');
  await expect(checkbox).toHaveAttribute('role', 'menuitemcheckbox');
  await expect(checkbox).toHaveAttribute('aria-checked', 'false');
  await checkbox.click();
  await expect(page.getByTestId('menu-checked')).toHaveText('true');
  await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByTestId('menu-checkbox-indicator').locator('svg')).toHaveCount(1);
  const beta = page.getByTestId('menu-radio-beta');
  await beta.click();
  await expect(page.getByTestId('menu-choice')).toHaveText('beta');
  await expect(beta).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByTestId('menu-radio-alpha')).toHaveAttribute('aria-checked', 'false');
}

test('Menu checkbox and radio items retain the primitive selection behavior', verifiesMenuOptions);
