import { expect, test, type Page } from '@playwright/test';

/** Confirm selected and caller-owned triggers deliver the rendered native refs. */
async function verifiesPopoverRefs({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-popover-refs--contract');
  const selected = page.getByTestId('popover-selected-trigger');
  const child = page.getByTestId('popover-child-trigger');
  await expect(selected).toBeVisible({ timeout: 30_000 });
  await expect(selected).toHaveJSProperty('tagName', 'A');
  await expect(page.getByTestId('popover-selected-ref')).toHaveText('A');
  await expect(page.getByTestId('popover-parent-ref')).toHaveText('BUTTON');
  await expect(page.getByTestId('popover-child-ref')).toHaveText('BUTTON');

  await selected.click();
  await expect(page.getByTestId('popover-selected-content')).toBeVisible();
  await child.click();
  await expect(page.getByTestId('popover-child-content')).toBeVisible();
}

test('Popover triggers preserve selected and composed child refs', verifiesPopoverRefs);
