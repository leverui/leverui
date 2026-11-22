import { expect, test, type Page } from '@playwright/test';

/** Verify grouped headings and selection through the public Select parts. */
async function verifiesGroupedSelect({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-guide--contract');
  await page.getByTestId('select-grouped-trigger').click();
  const content = page.getByTestId('select-grouped-content');
  await expect(content).toBeVisible({ timeout: 30_000 });
  await expect(content.locator('[data-select-item-group-label]')).toHaveText(['Books', 'Movies']);
  await content.getByRole('option', { name: 'Midnight Ferry' }).click();
  await expect(page.getByTestId('select-grouped-trigger')).toContainText('Midnight Ferry');
}

test('Select renders and selects grouped guide options', verifiesGroupedSelect);

/** Verify descriptions remain in the popup without changing the selected label. */
async function verifiesDescribedSelect({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-guide--contract');
  const trigger = page.getByTestId('select-described-trigger');
  await expect(trigger).toContainText('Pro Plan', { timeout: 30_000 });
  await trigger.click();
  const content = page.getByTestId('select-described-content');
  await expect(content.getByText('$29/month - Advanced features')).toBeVisible();
  await content.locator('[data-value="basic"]').click();
  await expect(trigger).toContainText('Basic Plan');
}

test('Select shows option descriptions and selected labels', verifiesDescribedSelect);

/** Verify a long option list scrolls and can select its last value. */
async function verifiesOverflowSelect({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-guide--contract');
  const trigger = page.getByTestId('select-overflow-trigger');
  await trigger.click();
  const content = page.getByTestId('select-overflow-content');
  await expect(content).toBeVisible({ timeout: 30_000 });
  const heights = await content.evaluate(
    /** Compare the full option list with the clipped popup viewport. */
    (element) => ({ scroll: element.scrollHeight, client: element.clientHeight }),
  );
  expect(heights.scroll).toBeGreaterThan(heights.client);
  await content.locator('[data-value="movie-20"]').scrollIntoViewIfNeeded();
  await content.locator('[data-value="movie-20"]').click();
  await expect(trigger).toContainText('Movie 20');
}

test('Select scrolls overflow options and selects the last item', verifiesOverflowSelect);
