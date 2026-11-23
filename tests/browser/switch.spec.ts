import { expect, test, type Page } from '@playwright/test';

/** Verify pointer, keyboard, and native form updates in a real browser. */
async function verifiesSwitchSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch--contract');
  const input = page.getByRole('checkbox', { name: 'Notifications' });
  await expect(input).not.toBeChecked({ timeout: 30_000 });
  await page.getByText('Notifications').click();
  await expect(input).toBeChecked();
  await expect(input).toBeFocused();
  await expect(page.getByTestId('switch-value')).toHaveText('on');
  expect(
    await page.getByTestId('switch-form').evaluate(
      /** Read the actual submitted form value. */
      (form) => new FormData(form as HTMLFormElement).get('notifications'),
    ),
  ).toBe('yes');
  await input.focus();
  await input.press('Space');
  await expect(input).not.toBeChecked();
}

test('Switch changes a native form value with pointer and Space', verifiesSwitchSelection);

/** Keep the root and selection stable while recipe variants change. */
async function verifiesSwitchRecipe({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch--contract');
  const root = page.getByTestId('switch-root');
  const control = page.getByTestId('switch-control');
  await expect(root).toHaveClass(/lui-switch__root/, { timeout: 30_000 });
  const before = await control.evaluate(
    /** Read the initial track width from the applied recipe. */
    (element) => getComputedStyle(element).width,
  );
  await root.evaluate(
    /** Mark this node so root replacement is observable. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.getByTestId('switch-appearance-toggle').click();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  const after = await control.evaluate(
    /** Read the track width after the live size update. */
    (element) => getComputedStyle(element).width,
  );
  expect(after).not.toBe(before);
  await expect(page.getByRole('checkbox', { name: 'Notifications' })).not.toBeChecked();
}

test('Switch changes size and variant without replacing selection', verifiesSwitchRecipe);

/** Check the primitive states and externally owned machine composition. */
async function verifiesSwitchStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch--states');
  const disabled = page.getByRole('checkbox', { name: 'Disabled' });
  await expect(disabled).toBeDisabled({ timeout: 30_000 });
  await expect(disabled).toBeChecked();
  await page.getByText('Disabled').click({ force: true });
  await expect(disabled).toBeChecked();
  const readonly = page.getByRole('checkbox', { name: 'Readonly' });
  await readonly.focus();
  await readonly.press('Space');
  await expect(readonly).toBeChecked();
  const invalid = page.getByRole('checkbox', { name: 'Invalid required' });
  await expect(invalid).toHaveAttribute('aria-invalid', 'true');
  await expect(invalid).toHaveAttribute('required', '');
  const external = page.getByRole('checkbox', { name: 'External' });
  await expect(external).toBeChecked();
  await external.focus();
  await external.press('Space');
  await expect(external).not.toBeChecked();
}

test(
  'Switch preserves disabled, readonly, invalid, required, and provider paths',
  verifiesSwitchStates,
);
