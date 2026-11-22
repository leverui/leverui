import { expect, test, type Page } from '@playwright/test';

/** Verify an offscreen collection option becomes mounted and selectable. */
async function verifiesVirtualSelect({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-virtualized--contract');
  const trigger = page.getByTestId('virtual-select-trigger');
  await trigger.click();
  const content = page.getByTestId('virtual-select-content');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(content.getByRole('option')).toHaveCount(8);
  await expect(content.getByRole('option', { name: 'Country 100' })).toHaveCount(0);
  await content.focus();
  await content.press('End');
  await expect(page.getByTestId('virtual-select-scroll-index')).toHaveText('99');
  const last = content.getByRole('option', { name: 'Country 100' });
  await expect(last).toBeVisible();
  await expect(last).toHaveAttribute('aria-posinset', '100');
  await expect(last).toHaveAttribute('aria-setsize', '100');
  await last.click();
  await expect(trigger).toContainText('Country 100');
}

test('Select navigates and chooses a virtualized option', verifiesVirtualSelect);
