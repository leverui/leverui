import { expect, test, type Page } from '@playwright/test';

/** Verify outside-dismissal options, multiple triggers, and final focus. */
async function verifiesModalOptions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dialog-machine-options--contract');
  const first = page.getByTestId('dialog-options-first-trigger');
  const second = page.getByTestId('dialog-options-second-trigger');
  const content = page.getByTestId('dialog-options-modal-content');
  await first.click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'dialog');
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await page.mouse.click(5, 5);
  await expect(content).toBeVisible();
  await content.getByRole('button', { name: 'Allow outside close' }).click();
  await page.mouse.click(5, 5);
  await expect(content).toHaveCount(0);
  await expect(page.getByTestId('dialog-final-focus')).toBeFocused();

  await second.click();
  await expect(content).toBeVisible();
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await content.getByRole('button', { name: 'Close modal options' }).click();
  await expect(content).toHaveCount(0);
  await expect(page.getByTestId('dialog-final-focus')).toBeFocused();
}

test('Dialog forwards modal dismissal and final-focus options', verifiesModalOptions);

/** Verify nonmodal content permits page interaction without closing. */
async function verifiesNonmodalOptions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dialog-machine-options--contract');
  await page.getByTestId('dialog-nonmodal-trigger').click();
  const content = page.getByTestId('dialog-nonmodal-content');
  const outside = page.getByTestId('dialog-outside-action');
  await expect(content).toBeVisible();
  await expect(content).not.toHaveAttribute('aria-modal', 'true');
  await outside.click();
  await expect(page.getByTestId('dialog-outside-count')).toHaveText('1');
  await expect(content).toBeVisible();
  await outside.focus();
  await expect(outside).toBeFocused();
  await content.getByRole('button', { name: 'Close nonmodal' }).click();
  await expect(content).toHaveCount(0);
}

test('Dialog nonmodal mode leaves the page interactive', verifiesNonmodalOptions);
