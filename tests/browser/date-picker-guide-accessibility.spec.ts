import { expect, test, type Page } from '@playwright/test';
import { scanWcagViolations } from './axe-scan';

/** Scan restricted and localized calendar views after they become visible. */
async function verifiesAdvancedAccessibility({ page }: { page: Page }): Promise<void> {
  for (const story of [
    '/iframe.html?id=components-datepicker-period-guide--month-popup',
    '/iframe.html?id=components-datepicker-period-guide--year-popup',
    '/iframe.html?id=components-datepicker-locale-guide--persian',
  ]) {
    await page.goto(story);
    if (story.includes('month-popup')) {
      await page.getByRole('button', { name: 'Open month picker' }).click();
    } else if (story.includes('year-popup')) {
      await page.getByRole('button', { name: 'Open year picker' }).click();
    }
    await expect(page.locator('[data-date-picker-table]:visible').first()).toBeVisible({
      timeout: 30_000,
    });
    const violations = await scanWcagViolations(page);
    expect(violations, story).toEqual([]);
  }
}

test(
  'DatePicker period and Persian views have no common WCAG A or AA violations',
  verifiesAdvancedAccessibility,
);
