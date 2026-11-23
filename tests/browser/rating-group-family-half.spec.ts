import { expect, test, type Page } from '@playwright/test';

/** Select a half star with a pointer and advance by half with the keyboard. */
async function verifiesHalfSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating-group--half');
  const fourth = page.getByRole('radiogroup', { name: 'Quality' }).getByRole('radio').nth(3);
  await expect(fourth).toHaveAccessibleName('4 stars');
  const input = page.locator('input[name="score"]');
  await expect(input).toHaveValue('2.5');
  await fourth.hover({ position: { x: 2, y: 2 } });
  await fourth.hover({ position: { x: 4, y: 4 } });
  await fourth.click({ position: { x: 4, y: 4 } });
  await expect(fourth.locator('.lui-rating-group__itemIndicator')).toHaveAttribute('data-half', '');
  await expect(input).toHaveValue('3.5');
  // Zag 2 names an item holding a half value by that value.
  await expect(fourth).toHaveAccessibleName('3.5 stars');
  await page.mouse.move(0, 0);
  await fourth.focus();
  await fourth.press('ArrowRight');
  await expect(input).toHaveValue('4');
}

test('Rating Group selects and advances half scores', verifiesHalfSelection);
