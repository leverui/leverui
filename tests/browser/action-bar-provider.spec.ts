import { expect, test, type Page } from '@playwright/test';

/** Verify PropsProvider forwards the primitive positioning only to machine-owned Roots. */
async function verifiesProviderPositioning({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-action-bar-provider--positioning');
  const owned = page.getByTestId('provider-owned-content');
  const caller = page.getByTestId('provider-caller-content');
  await expect(owned).toBeVisible({ timeout: 30_000 });
  await expect(caller).toBeVisible();
  await expect(owned).toHaveAttribute('data-placement', 'top-start');
  await expect(caller).toHaveAttribute('data-placement', 'bottom-end');
}

test('Action Bar provider positioning reaches only its owned machine', verifiesProviderPositioning);
