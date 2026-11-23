import { expect, test, type Page } from '@playwright/test';

/** Verify real keyboard creation, item deletion, clearing, and form submission. */
async function verifiesTagEditing({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input--contract');
  const input = page.getByPlaceholder('Add framework');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await input.fill('React');
  await input.press('Enter');
  await expect(page.getByTestId('tags-input-value')).toHaveText('Solid, React');
  expect(
    await page.getByTestId('tags-input-form').evaluate(
      /** Read the actual browser form value after the keyboard update. */
      (form) => new FormData(form as HTMLFormElement).get('frameworks'),
    ),
  ).toContain('React');
  await page.getByRole('button', { name: 'Delete tag React' }).click();
  await expect(page.getByTestId('tags-input-value')).toHaveText('Solid');
  await page.getByRole('button', { name: 'Clear all tags' }).click();
  await expect(page.getByTestId('tags-input-value')).toBeEmpty();
}

test('Tags Input edits tags by keyboard and keeps native form state', verifiesTagEditing);

/** Keep the machine and native field stable through a live recipe update. */
async function verifiesReactiveAppearance({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input--contract');
  const root = page.getByTestId('tags-input-root');
  const control = page.getByTestId('tags-input-control');
  await expect(root).toHaveClass(/lui-tags-input__root/, { timeout: 30_000 });
  const before = await control.evaluate(
    /** Read the initial control height before the recipe change. */
    (element) => getComputedStyle(element).minHeight,
  );
  await root.evaluate(
    /** Mark the existing root to detect accidental replacement. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.getByTestId('tags-input-appearance').click();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  const after = await control.evaluate(
    /** Read the live control height after the recipe change. */
    (element) => getComputedStyle(element).minHeight,
  );
  expect(after).not.toBe(before);
  await expect(page.getByTestId('tags-input-value')).toHaveText('Solid');
}

test(
  'Tags Input changes recipe variants without replacing its machine',
  verifiesReactiveAppearance,
);

/** Verify disabled, readonly, invalid, required, and external machine paths. */
async function verifiesMachineStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input--states');
  await expect(page.getByPlaceholder('Disabled input')).toBeDisabled({ timeout: 30_000 });
  await expect(page.getByPlaceholder('Readonly input')).toBeDisabled();
  await expect(page.getByPlaceholder('Readonly input')).toHaveAttribute('data-readonly', '');
  await expect(page.getByPlaceholder('Required input')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('input[required]')).toHaveCount(1);
  const external = page.getByPlaceholder('External input');
  await external.fill('Added');
  await external.press('Enter');
  await expect(page.getByTestId('tags-input-provider-root')).toContainText('Added');
}

test('Tags Input preserves machine states and external ownership', verifiesMachineStates);
