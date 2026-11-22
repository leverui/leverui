import { expect, test, type Page } from '@playwright/test';

/** Keep the parent open while dismissing a nested Popover layer. */
async function verifiesNestedPopover({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-popover-nested--nested');
  const parentTrigger = page.getByTestId('nested-popover-trigger');
  const childTrigger = page.getByTestId('nested-child-trigger');
  const parent = page.getByTestId('nested-parent-content');
  const child = page.getByTestId('nested-child-content');
  await expect(parentTrigger).toBeVisible({ timeout: 30_000 });
  await parentTrigger.click();
  await expect(parent).toBeVisible();
  await childTrigger.click();
  await expect(child).toBeVisible();
  await expect(parent).toBeVisible();
  await expect(page.getByTestId('nested-child-body')).toHaveCSS('padding', '16px');
  await page.keyboard.press('Escape');
  await expect(child).toBeHidden();
  await expect(parent).toBeVisible();
  await expect(childTrigger).toBeFocused();
}

test('Popover keeps a parent open while dismissing its nested child', verifiesNestedPopover);
