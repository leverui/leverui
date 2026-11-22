import { expect, test, type Page } from '@playwright/test';

/** Check pointer, keyboard, and browser form selection. */
async function verifiesRatingSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating-group--contract');
  const group = page.getByRole('radiogroup', { name: 'Quality' });
  const second = page.getByRole('radio', { name: '2 stars' });
  const fourth = page.getByRole('radio', { name: '4 stars' });
  await expect(group).toBeVisible({ timeout: 30_000 });
  await expect(group.getByRole('radio')).toHaveCount(5);
  await expect(second).toHaveAttribute('aria-checked', 'true');
  await fourth.click();
  await expect(fourth).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByTestId('rating-group-selected')).toHaveText('4');
  expect(
    await page.getByTestId('rating-group-form').evaluate(
      /** Read the browser's actual submitted value. */
      (form) => new FormData(form as HTMLFormElement).get('score'),
    ),
  ).toBe('4');
  await page.mouse.move(0, 0);
  await fourth.focus();
  await fourth.press('ArrowLeft');
  await expect(page.getByRole('radio', { name: '3 stars' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
}

test('Rating Group selects with pointer and keyboard', verifiesRatingSelection);

/** Confirm a size update preserves the machine and changes visual text size. */
async function verifiesRatingSize({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating-group--contract');
  const root = page.getByTestId('rating-group-root');
  const item = page.getByRole('radio', { name: '2 stars' });
  await expect(root).toHaveClass(/leverui-rating-group__root/, { timeout: 30_000 });
  const before = await item.evaluate(
    /** Read the initial authored CSS size. */
    (element) => getComputedStyle(element).fontSize,
  );
  await root.evaluate(
    /** Mark the root so replacement is observable. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.getByTestId('toggle-rating-group-size').click();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(item).toHaveAttribute('aria-checked', 'true');
  const after = await item.evaluate(
    /** Read the updated authored CSS size. */
    (element) => getComputedStyle(element).fontSize,
  );
  expect(after).not.toBe(before);
}

test('Rating Group changes size without replacing selection', verifiesRatingSize);

/** Let consumer CSS override local rating colors and item dimensions. */
async function verifiesRatingCssOverride({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating-group--contract');
  const root = page.getByTestId('rating-group-root');
  const selected = page.getByRole('radio', { name: '2 stars' });
  await expect(root).toHaveAttribute('data-size', 'sm');
  await page.addStyleTag({
    content:
      '.leverui-rating-group__root { --leverui-rating-group-foreground-color: rgb(1, 2, 3); --leverui-rating-group-item-font-size: 37px; }',
  });
  const foreground = selected.locator('[data-fg]');
  const color = await foreground.evaluate(
    /** Read the foreground icon after the app stylesheet wins the cascade. */
    (element) => getComputedStyle(element).color,
  );
  const size = await selected.evaluate(
    /** Read the item font size after its public variable changes. */
    (element) => getComputedStyle(element).fontSize,
  );
  expect(color).toBe('rgb(1, 2, 3)');
  expect(size).toBe('37px');
}

test('Rating Group accepts ordinary consumer CSS overrides', verifiesRatingCssOverride);

/** Preserve public classes and native selection without default presentation. */
async function verifiesUnstyledRating({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating-group--unstyled');
  const root = page.getByTestId('rating-unstyled');
  const group = page.getByRole('radiogroup', { name: 'Unstyled score' });
  const fourth = group.getByRole('radio', { name: '4 stars' });
  await expect(root).toHaveAttribute('data-unstyled', '');
  await expect(root).toHaveClass(/leverui-rating-group__root/);
  await expect(group).toHaveAttribute('data-unstyled', '');
  await expect(group.locator('.leverui-rating-group__itemIndicator').first()).toHaveAttribute(
    'data-unstyled',
    '',
  );
  const display = await root.evaluate(
    /** Read the native div layout after the authored recipe is suppressed. */
    (element) => getComputedStyle(element).display,
  );
  expect(display).toBe('block');
  await fourth.click();
  await expect(fourth).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('input[name="unstyled-score"]')).toHaveValue('4');
}

test('Rating Group unstyled path keeps native interaction', verifiesUnstyledRating);

/** Verify half and disabled states survive browser rendering. */
async function verifiesRatingStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-rating-group--half');
  // Zag 2 names an item holding a half value by that value.
  const half = page.getByRole('radio', { name: '2.5 stars' });
  await expect(half).toHaveAttribute('aria-checked', 'true', { timeout: 30_000 });
  await expect(half.locator('.leverui-rating-group__itemIndicator')).toHaveAttribute(
    'data-half',
    '',
  );
  await expect(half.locator('svg')).toHaveCount(2);
  await page.goto('/iframe.html?id=components-rating-group--disabled');
  const second = page.getByRole('radio', { name: '2 stars' });
  const fourth = page.getByRole('radio', { name: '4 stars' });
  await expect(second).toHaveAttribute('aria-checked', 'true', { timeout: 30_000 });
  await expect(fourth).toHaveAttribute('aria-disabled', 'true');
  await fourth.click({ force: true });
  await expect(second).toHaveAttribute('aria-checked', 'true');
}

test('Rating Group renders half and disabled states', verifiesRatingStates);
