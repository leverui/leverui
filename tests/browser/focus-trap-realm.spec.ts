import { expect, test, type Page } from '@playwright/test';
import { pressBrowserTab } from './keyboard-navigation';

/** Verify an iframe-created HTML root traps focus after entering the parent DOM. */
async function verifiesCrossDocumentRoot({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-focus-trap-realm--contract');
  const launcher = page.getByTestId('cross-document-launcher');
  const root = page.getByTestId('cross-document-root');
  const input = page.getByRole('textbox', { name: 'Cross-document input' });
  const close = page.getByRole('button', { name: 'End cross-document trap' });
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-foreign-realm', 'true');
  await expect(root).toHaveJSProperty('tagName', 'ARTICLE');
  await launcher.focus();
  await launcher.press('Enter');
  await expect(input).toBeFocused();
  await pressBrowserTab(page);
  await expect(close).toBeFocused();
  await pressBrowserTab(page);
  await expect(input).toBeFocused();
  await close.click();
  await expect(launcher).toBeFocused();
}

test('Focus Trap accepts an HTML root from another document', verifiesCrossDocumentRoot);
