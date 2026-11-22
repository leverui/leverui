import { expect, test, type Page } from '@playwright/test';

/** Read the manually composed rating's native form value. */
function readCustomValue(element: HTMLElement): FormDataEntryValue | null {
  return new FormData(element as HTMLFormElement).get('custom-score');
}

/** Verify custom icons, translated names, selection, and form integration. */
async function verifiesCustomRating({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating-group-family-custom--custom');
  const group = page.getByRole('radiogroup', { name: 'Custom score' });
  await expect(group.getByRole('radio')).toHaveCount(3);
  await expect(group.getByRole('radio', { name: '1 points' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  const third = group.getByRole('radio', { name: '3 points' });
  await expect(third).toHaveAttribute('aria-setsize', '3');
  await expect(third.locator('svg')).toHaveCount(2);
  await expect(third.locator('svg[data-bg]')).toHaveCount(1);
  await expect(third.locator('svg[data-fg]')).toHaveCount(1);
  await third.click();
  await expect(third).toHaveAttribute('aria-checked', 'true');
  expect(await page.getByTestId('rating-custom-form').evaluate(readCustomValue)).toBe('3');
}

test('Rating Group custom composition retains selection and native forms', verifiesCustomRating);
