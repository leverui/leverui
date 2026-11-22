import { expect, test, type Page } from '@playwright/test';

/** Open a named Date Picker example and its calendar surface. */
async function openCalendar(page: Page, example: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-date-picker--${example}`);
  await page.getByRole('button', { name: 'Open calendar' }).click();
}

/** Keep each grid named as the localized range changes across calendar views. */
async function verifiesViewNames({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-date-picker--format-parse');
  const input = page.getByRole('textbox', { name: 'Invoice date' });
  await input.fill('05/11/26');
  await input.press('Tab');
  await page.getByRole('button', { name: 'Open calendar' }).click();
  await expect(page.getByRole('grid', { name: 'November 2026' })).toBeVisible();
  await page.getByRole('button', { name: 'Switch to month view' }).click();
  await expect(page.getByRole('grid', { name: '2026' })).toBeVisible();
  await page.getByRole('button', { name: 'Switch to year view' }).click();
  await expect(page.getByRole('grid', { name: '2020 - 2029' })).toBeVisible();
  await page.getByRole('button', { name: 'Switch to next decade' }).click();
  await expect(page.getByRole('grid', { name: '2030 - 2039' })).toBeVisible();
}

/** Match each localized grid name to the date machine's visible range text. */
async function verifiesLocalizedNames({ page }: { page: Page }): Promise<void> {
  for (const example of ['localization', 'persian-calendar']) {
    await openCalendar(page, example);
    const range = await page
      .locator('[data-date-picker-range-text]')
      .filter({ visible: true })
      .first()
      .innerText();
    await expect(page.getByRole('grid', { name: range })).toBeVisible();
  }
}

/** Name both day grids when the picker displays two calendar months. */
async function verifiesMultipleMonthNames({ page }: { page: Page }): Promise<void> {
  await openCalendar(page, 'multiple-months');
  const range = await page
    .locator('[data-date-picker-range-text]')
    .filter({ visible: true })
    .first()
    .innerText();
  const firstMonth = range.split(' - ')[0];
  if (!firstMonth) throw new Error('The visible calendar range is empty.');
  await expect(page.getByRole('grid', { name: firstMonth })).toHaveCount(2);
}

/** Announce both endpoints of a range selection in the day-grid name. */
async function verifiesRangeName({ page }: { page: Page }): Promise<void> {
  await openCalendar(page, 'range-selection');
  const range = await page
    .locator('[data-date-picker-range-text]')
    .filter({ visible: true })
    .first()
    .innerText();
  await expect(page.getByRole('grid', { name: range })).toBeVisible();
}

test('Date Picker day, month, and year grids have reactive names', verifiesViewNames);
test('Date Picker localized grids retain their names', verifiesLocalizedNames);
test('Date Picker paired month grids retain the name', verifiesMultipleMonthNames);
test('Date Picker range grid names both visible endpoints', verifiesRangeName);
