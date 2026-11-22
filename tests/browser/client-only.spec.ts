import { expect, test, type Page } from '@playwright/test';

/** Verify mounted render functions and direct children in a Solid story. */
async function verifiesClientOnlyStory({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-clientonly--contract');
  const button = page.getByTestId('client-only-button');
  await expect(button).toBeVisible({ timeout: 30_000 });
  await expect(button).toContainText('/iframe.html: 0');
  await expect(page.getByTestId('client-only-fallback')).toHaveCount(0);
  await expect(page.getByTestId('client-only-direct')).toHaveText('Direct child');
  await button.click();
  await expect(button).toContainText('/iframe.html: 1');
  await expect(page.getByTestId('client-only-contract').locator(':scope > *')).toHaveCount(2);
}

test('ClientOnly mounts deferred browser content without a wrapper', verifiesClientOnlyStory);
