import { expect, test, type Page } from '@playwright/test';
import { scanWcagViolations } from './axe-scan';

/** Check refs, native aliases, custom rendering, and the context clear action. */
async function verifiesCustomComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput-composition--custom');
  const root = page.getByTestId('date-input-custom-root');
  const segments = page.getByTestId('date-input-custom-segments');
  const hidden = page.getByTestId('date-input-custom-hidden');
  await expect(root).toHaveAttribute('data-root-ref', 'attached', { timeout: 30_000 });
  await expect(root).toHaveJSProperty('tagName', 'SECTION');
  await expect(segments).toHaveAttribute('data-group-ref', 'attached');
  await expect(segments).toHaveAttribute('translate', 'no');
  await expect(segments.getByRole('spinbutton')).toHaveCount(3);
  await expect(hidden).toHaveValue('3/14/2026');
  await page.getByRole('button', { name: 'Clear date' }).click();
  await expect(hidden).toHaveValue('');
}

test('DateInput composes caller elements and clears through context', verifiesCustomComposition);

/** Check lower-level Segment parts keep Zag editing behavior. */
async function verifiesManualSegments({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput-composition--manual');
  const segments = page.getByTestId('date-input-manual-segments');
  const hidden = page.getByTestId('date-input-manual-hidden');
  await expect(segments.getByRole('spinbutton')).toHaveCount(3, { timeout: 30_000 });
  await segments.locator('[data-type="day"]').focus();
  await page.keyboard.press('ArrowUp');
  await expect(hidden).toHaveValue('3/15/2026');
}

test('DateInput supports manually composed segments', verifiesManualSegments);

/** Scan the wrapped date control for common WCAG A and AA violations. */
async function verifiesAccessibility({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-dateinput--basic');
  await expect(page.getByTestId('date-input-basic-segments')).toBeVisible({ timeout: 30_000 });
  const violations = await scanWcagViolations(page, '[data-date-input-root]');
  expect(violations).toEqual([]);
}

test('DateInput has no common WCAG A or AA violations', verifiesAccessibility);
