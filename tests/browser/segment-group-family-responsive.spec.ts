import { expect, test, type Page } from '@playwright/test';
import { expectIndicatorAligned } from './segment-group-indicator-assertions';

/** Read the native selected form value. */
function formValue(element: HTMLElement): FormDataEntryValue | null {
  return new FormData(element as HTMLFormElement).get('responsive');
}

/** Read one rendered segment's computed height. */
function itemHeight(element: HTMLElement): string {
  return getComputedStyle(element).height;
}

/** Verify responsive CSS changes while the native radio machine remains. */
async function verifiesResponsiveSize({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-segment-group-family-responsive--responsive');
  const root = page.getByTestId('segment-responsive-root');
  const form = page.getByTestId('segment-responsive-form');
  const selected = root.getByRole('radio', { name: 'Solid' });
  const item = root.locator('.leverui-segment-group__item').nth(1);
  const indicator = page.getByTestId('segment-responsive-indicator');
  await expect(selected).toBeChecked({ timeout: 30_000 });
  const smallHeight = await item.evaluate(itemHeight);
  await expectIndicatorAligned(indicator, item);
  expect(await form.evaluate(formValue)).toBe('Solid');
  await root.evaluate(
    /** Mark the native root to catch remounts across the breakpoint. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(selected).toBeChecked();
  const largeHeight = await item.evaluate(itemHeight);
  expect(Number.parseFloat(largeHeight)).toBeGreaterThan(Number.parseFloat(smallHeight));
  await expectIndicatorAligned(indicator, item);
  expect(await form.evaluate(formValue)).toBe('Solid');

  await page.setViewportSize({ width: 600, height: 700 });
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(selected).toBeChecked();
  await expect
    .poll(
      /** Wait for the CSS media query to restore the smaller size. */
      () => item.evaluate(itemHeight),
    )
    .toBe(smallHeight);
  await expectIndicatorAligned(indicator, item);
  expect(await form.evaluate(formValue)).toBe('Solid');
}

test('Segment Group responsive size preserves selection and indicator', verifiesResponsiveSize);
