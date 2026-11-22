import { expect, test, type Locator, type Page } from '@playwright/test';

/** Read the selected native form value for the RTL group. */
function formValue(element: HTMLElement): FormDataEntryValue | null {
  return new FormData(element as HTMLFormElement).get('direction');
}

/** Measure the selected item and indicator's horizontal alignment. */
async function indicatorOffset(indicator: Locator, item: Locator): Promise<number> {
  const indicatorBox = await indicator.boundingBox();
  const itemBox = await item.boundingBox();
  if (!indicatorBox || !itemBox) throw new Error('RTL Segment Group geometry is unavailable.');
  return Math.abs(indicatorBox.x - itemBox.x);
}

/** Verify RTL keyboard selection, form value, and indicator geometry. */
async function verifiesRtlSegments({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group-family-rtl--rtl');
  const root = page.getByTestId('segment-rtl-root');
  const form = page.getByTestId('segment-rtl-form');
  const first = root.getByRole('radio', { name: 'First' });
  const second = root.getByRole('radio', { name: 'Second' });
  const indicator = page.getByTestId('segment-rtl-indicator');
  await expect(root).toHaveAttribute('dir', 'rtl', { timeout: 30_000 });
  await expect(first).toBeChecked();
  expect(await form.evaluate(formValue)).toBe('First');
  await first.focus();
  const webkit = page.context().browser()?.browserType().name() === 'webkit';
  const forwardKey = webkit ? 'ArrowRight' : 'ArrowLeft';
  const backwardKey = webkit ? 'ArrowLeft' : 'ArrowRight';
  await first.press(forwardKey);
  await expect(second).toBeChecked();
  await expect(second).toBeFocused();
  expect(await form.evaluate(formValue)).toBe('Second');
  await expect
    .poll(
      /** Wait for the Zag indicator to reach the newly selected item. */
      () => indicatorOffset(indicator, root.locator('.leverui-segment-group__item').nth(1)),
    )
    .toBeLessThan(2);
  await second.press(backwardKey);
  await expect(first).toBeChecked();
  expect(await form.evaluate(formValue)).toBe('First');
}

test('Segment Group follows native RTL arrows and indicator geometry', verifiesRtlSegments);
