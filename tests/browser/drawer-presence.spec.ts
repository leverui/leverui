import { expect, test, type Page } from '@playwright/test';

/** Verify the inherited primitive presence option suppresses the first entry animation. */
async function verifiesInitialPresence({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-drawer-presence--skipped');
  const content = page.getByTestId('drawer-initial-presence');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await page.waitForTimeout(500);
  await expect(page.getByTestId('drawer-animation-count')).toHaveText('0');
  await page.goto('/iframe.html?id=components-drawer-presence--animated');
  await expect(content).toBeVisible();
  await expect(page.getByTestId('drawer-animation-count')).toHaveText(/^[1-9]\d*$/);
}

test('Drawer supports skipAnimationOnMount', verifiesInitialPresence);
