import { expect, test, type Page } from '@playwright/test';

/** Verify the public unstyled prop suppresses Command's overflow rule. */
async function verifiesUnstyledDialog({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-command-dialog-css--unstyled');
  await page.getByRole('button', { name: 'Open unstyled Command' }).click();
  const content = page.getByRole('dialog', { name: 'Unstyled Command' });
  await expect(content).toHaveAttribute('data-unstyled', '');
  await expect(content).toHaveCSS('overflow', 'visible');
}

test('unstyled Command dialog omits authored overflow clipping', verifiesUnstyledDialog);
