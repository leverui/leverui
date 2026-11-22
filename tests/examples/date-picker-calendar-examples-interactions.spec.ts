import { expect, test, type Page } from '@playwright/test';

/** Open one inline calendar story in the gallery canvas. */
async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-date-picker-calendar--${id}`);
}

/** Choose the first enabled date in the currently displayed day view. */
function enabledDays(page: Page) {
  return page
    .locator('[data-date-picker-table-cell-trigger]:not([aria-disabled="true"])')
    .filter({ visible: true });
}

/** Confirm caller-owned state changes after a date selection. */
async function verifiesControlledSelection({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'controlled');
  await expect(page.getByText('Selected: 2025-03-15')).toBeVisible();
  await enabledDays(page).first().click();
  await expect(page.getByText('Selected: 2025-03-15')).toHaveCount(0);
  await expect(page.getByText(/^Selected: 2025-/)).toBeVisible();
}

/** Ensure a fourth date cannot exceed the three-date limit. */
async function verifiesSelectionLimit({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'max-selected');
  const days = enabledDays(page);
  const fourthDate = await days.nth(3).getAttribute('data-value');
  if (!fourthDate) throw new Error('Expected a fourth selectable calendar day.');
  for (let index = 0; index < 3; index += 1) {
    await days.nth(index).click();
  }
  await expect(
    page
      .locator('[data-date-picker-table-cell-trigger][data-selected=""]')
      .filter({ visible: true }),
  ).toHaveCount(3);
  await expect(
    page
      .locator(`[data-date-picker-table-cell-trigger][data-value="${fourthDate}"]`)
      .filter({ visible: true }),
  ).toHaveAttribute('aria-disabled', 'true');
}

/** Reveal weekday meeting slots when a calendar date is selected. */
async function verifiesTimeGrid({ page }: { page: Page }): Promise<void> {
  await openStory(page, 'time-grid');
  await expect(page.getByText('Available time slots will appear here')).toBeVisible();
  await enabledDays(page).first().click();
  await expect(page.getByText('Available time slots will appear here')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^\d{2}:\d{2}$/ }).first()).toBeVisible();
}

test('Date Picker Calendar controlled selection updates', verifiesControlledSelection);
test('Date Picker Calendar limits multi-selection', verifiesSelectionLimit);
test('Date Picker Calendar reveals time slots', verifiesTimeGrid);
