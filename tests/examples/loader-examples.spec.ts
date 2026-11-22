import { expect, test, type Page } from '@playwright/test';

/** Verify the inline and Badge Loader compositions. */
async function verifiesInlineLoaders({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-loader--basic');
  await expect(page.getByText('Loading...')).toBeVisible();
  await expect(page.locator('#storybook-root .leverui-spinner')).toHaveCount(1);
  await page.goto('/iframe.html?id=components-loader--with-badge');
  await expect(page.locator('#storybook-root .leverui-badge')).toContainText('Loading...');
}

/** Verify the external button mounts and removes the form overlay. */
async function verifiesLoaderOverlay({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-loader--with-overlay');
  await expect(page.getByLabel('First name')).toBeVisible();
  await expect(page.getByLabel('Last name')).toBeVisible();
  await expect(page.locator('#storybook-root .leverui-loader-overlay')).toHaveCount(0);
  await page.getByRole('button', { name: 'Toggle loading' }).click();
  await expect(page.locator('#storybook-root .leverui-loader-overlay')).toHaveCount(1);
  await expect(page.getByText('Loading...')).toBeVisible();
  await page.getByRole('button', { name: 'Toggle loading' }).click();
  await expect(page.locator('#storybook-root .leverui-loader-overlay')).toHaveCount(0);
}

test('Loader Basic and WithBadge render the content', verifiesInlineLoaders);
test('Loader WithOverlay toggles over the form', verifiesLoaderOverlay);
