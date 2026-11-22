import { expect, test, type Page } from '@playwright/test';

/** Verify branch animation follows the user's reduced-motion setting. */
async function verifiesMotionPreference({ page }: { page: Page }): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/iframe.html?id=components-tree-view-motion--contract');
  const branch = page.getByTestId('motion-branch');
  const content = page.locator('[data-tree-view-node-group-content]');
  await expect(branch).toHaveAttribute('data-state', 'open', { timeout: 30_000 });
  await branch.click();
  await expect(branch).toHaveAttribute('data-state', 'closed');
  await expect(content).not.toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(content).toHaveCSS('animation-name', 'none');
  await branch.click();
  await expect(branch).toHaveAttribute('data-state', 'open');
  await expect(content).toHaveCSS('animation-name', 'none');
}

test('Tree View disables branch motion when reduced motion is requested', verifiesMotionPreference);
