import { expect, test, type Page } from '@playwright/test';

/** Verify reactive inheritance, explicit precedence, and external ownership. */
async function verifiesFloatingPanelDefaults({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-floating-panel-defaults--contract');
  const inherited = page.getByTestId('floating-inherited-trigger');
  const explicit = page.getByTestId('floating-explicit-trigger');
  const external = page.getByTestId('floating-external-trigger');
  await expect(inherited).toBeVisible({ timeout: 30_000 });
  await expect(inherited).toBeDisabled();
  await expect(explicit).toBeEnabled();
  await expect(external).toBeEnabled();
  await page.getByTestId('floating-toggle-default').click();
  await expect(inherited).toBeEnabled();
  await expect(explicit).toBeEnabled();
  await expect(external).toBeEnabled();
  await page.getByTestId('floating-toggle-default').click();
  await expect(inherited).toBeDisabled();
  await expect(explicit).toBeEnabled();
  await expect(external).toBeEnabled();
}

test(
  'Floating Panel provider defaults preserve precedence and caller state',
  verifiesFloatingPanelDefaults,
);
