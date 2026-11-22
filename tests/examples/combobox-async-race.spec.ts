import { expect, test, type Page } from '@playwright/test';

/** Keep a slower prior search from replacing a newer Combobox result. */
async function verifiesLatestQueryWins({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-combobox--async');
  const input = page.getByRole('combobox');
  // The local crew search answers larger result sets more slowly, so the broad
  // first query would resolve after the narrow second one if it were not cancelled.
  await input.fill('a');
  await input.fill('rhea');
  await expect(page.getByRole('option', { name: /Rhea Solano/ })).toBeVisible();
  await page.waitForTimeout(800);
  await expect(page.getByRole('option', { name: /Juno Marchetti/ })).toHaveCount(0);
  await expect(page.getByRole('option')).toHaveCount(1);
  await expect(page.getByRole('option', { name: /Rhea Solano/ })).toBeVisible();
}

test('Combobox keeps the latest asynchronous search result', verifiesLatestQueryWins);
