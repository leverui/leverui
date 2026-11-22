import { expect, test, type Page } from '@playwright/test';
import { expectIndicatorAligned } from './segment-group-indicator-assertions';

/** Read the computed item height from authored CSS. */
function itemHeight(element: HTMLElement): string {
  return getComputedStyle(element).height;
}

/** Read the selected value from the mounted native form. */
function formValue(element: HTMLElement): FormDataEntryValue | null {
  return new FormData(element as HTMLFormElement).get('framework');
}

/** Verify generated JSX labels, disabled updates, forms, and inherited size. */
async function verifiesDynamicItems({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-segment-group-family-dynamic--dynamic');
  const root = page.getByTestId('segment-dynamic-root');
  const form = page.getByTestId('segment-dynamic-form');
  const radios = root.getByRole('radio');
  const selected = root.getByRole('radio', { name: 'Solid' });
  const indicator = page.getByTestId('segment-dynamic-indicator');
  await expect(radios).toHaveCount(2, { timeout: 30_000 });
  await expect(selected).toBeChecked();
  await expectIndicatorAligned(indicator, root.locator('.leverui-segment-group__item').nth(1));
  await expect(root.locator('[aria-hidden="true"]')).toHaveText('◆');
  expect(await form.evaluate(formValue)).toBe('Solid');
  const smallHeight = await root
    .locator('.leverui-segment-group__item')
    .first()
    .evaluate(itemHeight);
  await root.evaluate(
    /** Mark the machine root so reactive updates cannot silently replace it. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await selected.evaluate(
    /** Mark the native radio that must survive a replacement data object. */
    (element) => element.setAttribute('data-original-radio', 'true'),
  );

  await page.getByTestId('segment-toggle-items').click();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(radios).toHaveCount(3);
  await expect(root.getByRole('radio', { name: 'React' })).toBeDisabled();
  await expect(selected).toBeChecked();
  await expect(selected).toHaveAttribute('data-original-radio', 'true');
  await expect(root.locator('[aria-hidden="true"]')).toHaveText('◇');
  await expectIndicatorAligned(indicator, root.locator('.leverui-segment-group__item').nth(1));
  expect(await form.evaluate(formValue)).toBe('Solid');
  await page.getByTestId('segment-toggle-size').click();
  const largeHeight = await root
    .locator('.leverui-segment-group__item')
    .first()
    .evaluate(itemHeight);
  expect(largeHeight).not.toBe(smallHeight);
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expectIndicatorAligned(indicator, root.locator('.leverui-segment-group__item').nth(1));
  await root.getByText('Vue').click();
  await expect(root.getByRole('radio', { name: 'Vue' })).toBeChecked();
  await expectIndicatorAligned(indicator, root.locator('.leverui-segment-group__item').nth(2));
  expect(await form.evaluate(formValue)).toBe('Vue');
}

test('generated Segment Group items and inherited size stay reactive', verifiesDynamicItems);
