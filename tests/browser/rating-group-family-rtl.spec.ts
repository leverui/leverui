import { expect, test, type Page } from '@playwright/test';

/** Read the selected RTL score from the mounted native form. */
function readRtlScore(element: HTMLElement): FormDataEntryValue | null {
  return new FormData(element as HTMLFormElement).get('rtl-score');
}

/** Verify the RTL pointer half and logical arrow direction against the primitive. */
async function verifiesRtlHalfSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating-group-family-rtl--half');
  const root = page.getByTestId('rating-rtl-root');
  const form = page.getByTestId('rating-rtl-form');
  const fourth = root.getByRole('radio').nth(3);
  await expect(fourth).toHaveAccessibleName('4 stars');
  await expect(root).toHaveAttribute('dir', 'rtl');
  expect(await form.evaluate(readRtlScore)).toBe('2.5');
  const bounds = await fourth.boundingBox();
  if (!bounds) throw new Error('RTL rating item has no layout box.');
  const rightHalf = Math.floor(bounds.width) - 3;
  const middle = Math.floor(bounds.height / 2);
  await fourth.hover({ position: { x: rightHalf + 1, y: middle } });
  await fourth.hover({ position: { x: rightHalf, y: middle } });
  await fourth.click({ position: { x: rightHalf, y: middle } });
  await expect(fourth.locator('.lui-rating-group__itemIndicator')).toHaveAttribute('data-half', '');
  expect(await form.evaluate(readRtlScore)).toBe('3.5');
  // Zag 2 names an item holding a half value by that value.
  await expect(fourth).toHaveAccessibleName('3.5 stars');
  await page.mouse.move(0, 0);
  await fourth.focus();
  await fourth.press('ArrowLeft');
  expect(await form.evaluate(readRtlScore)).toBe('4');
  await fourth.press('ArrowRight');
  expect(await form.evaluate(readRtlScore)).toBe('3.5');
}

test('Rating Group half scores follow RTL pointer and arrow directions', verifiesRtlHalfSelection);
