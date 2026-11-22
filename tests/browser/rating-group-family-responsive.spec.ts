import { expect, test, type Page } from '@playwright/test';

/** Read the foreground icon color for a selected rating item. */
function readForegroundColor(element: HTMLElement): string {
  return getComputedStyle(element).color;
}

/** Preserve one machine while generated items and CSS choices react. */
async function verifiesResponsiveRating({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-rating-group-family-responsive--responsive');
  const root = page.getByTestId('rating-responsive');
  const control = root.getByRole('radiogroup', { name: 'Responsive score' });
  const second = control.getByRole('radio', { name: '2 stars' });
  await expect(control.getByRole('radio')).toHaveCount(3);
  await expect(second).toHaveAttribute('aria-checked', 'true');
  const smallSize = await second.evaluate(
    /** Read the initial authored CSS font size. */
    (element) => getComputedStyle(element).fontSize,
  );
  const orangeColor = await second.locator('[data-fg]').evaluate(readForegroundColor);
  await root.evaluate(
    /** Mark the original root before media-query updates. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(control.getByRole('radio')).toHaveCount(5);
  await expect(second).toHaveAttribute('aria-checked', 'true');
  const largeSize = await second.evaluate(
    /** Read the updated authored CSS font size. */
    (element) => getComputedStyle(element).fontSize,
  );
  expect(largeSize).not.toBe(smallSize);
  const blueColor = await second.locator('[data-fg]').evaluate(readForegroundColor);
  expect(blueColor).not.toBe(orangeColor);
  const fourth = control.getByRole('radio', { name: '4 stars' });
  await expect(page.getByTestId('rating-hovered')).toHaveText('none');
  await fourth.hover({ position: { x: 2, y: 2 } });
  await fourth.hover({ position: { x: 4, y: 4 } });
  await expect(page.getByTestId('rating-hovered')).toHaveText('4');
  await page.mouse.move(0, 0);
  await expect(page.getByTestId('rating-hovered')).toHaveText('none');
  await expect(second).toHaveAttribute('aria-checked', 'true');
  await second.focus();
  await second.press('ArrowRight');
  await expect(control.getByRole('radio', { name: '3 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await page.setViewportSize({ width: 600, height: 700 });
  await expect(control.getByRole('radio')).toHaveCount(3);
  await expect(control.getByRole('radio', { name: '3 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
}

test('Rating Group responds without replacing its machine', verifiesResponsiveRating);

/** Apply finite responsive size attributes through authored media queries. */
async function verifiesCssBreakpoints({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-rating-group-family-responsive--css-breakpoints');
  const root = page.getByTestId('rating-css-responsive');
  const item = root.getByRole('radio', { name: '2 stars' });
  await expect(root).toHaveAttribute('data-size', 'xs');
  await expect(root).toHaveAttribute('data-size-md', 'lg');
  const narrowSize = await item.evaluate(
    /** Read the size selected before the medium breakpoint. */
    (element) => getComputedStyle(element).fontSize,
  );
  await page.setViewportSize({ width: 900, height: 700 });
  const wideSize = await item.evaluate(
    /** Read the size selected after the medium breakpoint. */
    (element) => getComputedStyle(element).fontSize,
  );
  expect(narrowSize).toBe('14px');
  expect(wideSize).toBe('24px');
  await expect(item).toHaveAttribute('aria-checked', 'true');
}

test('Rating Group uses authored responsive size selectors', verifiesCssBreakpoints);
