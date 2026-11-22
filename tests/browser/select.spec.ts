import { expect, test, type Page } from '@playwright/test';

/** Exercise Select's pointer, keyboard, clear, form, and reactive size paths. */
async function verifiesSelectContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select--contract');
  const trigger = page.getByTestId('select-trigger');
  const root = page.getByTestId('select-root');
  await expect(trigger).toHaveAttribute('role', 'combobox', { timeout: 30_000 });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toHaveAccessibleName('Framework');
  await expect(root).toHaveClass(/leverui-select__root/);
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('listbox', { name: 'Framework' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'Vue' })).toHaveAttribute('aria-disabled', 'true');
  await page.getByRole('option', { name: 'Solid' }).click();
  await expect(page.getByTestId('select-value')).toHaveText('solid');
  await expect(trigger).toHaveText('Solid');
  const clear = page.getByRole('button', { name: 'Clear framework' });
  await expect(clear).toBeVisible();
  expect(
    await page.getByTestId('select-form').evaluate(
      /** Read the browser's actual native form value. */
      (form) => new FormData(form as HTMLFormElement).get('framework'),
    ),
  ).toBe('solid');
  await root.evaluate(
    /** Mark the node to catch an unnecessary machine remount. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  const before = await trigger.evaluate(
    /** Read the initial finite size height. */
    (element) => getComputedStyle(element).height,
  );
  await page.getByTestId('select-size-toggle').click();
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(trigger).toHaveText('Solid');
  await expect(clear).toBeVisible();
  const after = await trigger.evaluate(
    /** Read the updated finite size height. */
    (element) => getComputedStyle(element).height,
  );
  expect(after).not.toBe(before);
  await clear.click();
  await expect(page.getByTestId('select-value')).toBeEmpty();
  await trigger.focus();
  await trigger.press('ArrowDown');
  const listbox = page.getByRole('listbox', { name: 'Framework' });
  await expect(listbox).toBeVisible();
  await listbox.press('ArrowDown');
  await listbox.press('Enter');
  await expect(page.getByTestId('select-value')).not.toBeEmpty();
}

test(
  'Select supports selection, form data, clear, keyboard, and live size',
  verifiesSelectContract,
);

/** Check disabled, readonly, and multiple machine states. */
async function verifiesSelectStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select--states');
  const disabled = page.getByRole('combobox', { name: 'Disabled' });
  const readonly = page.getByRole('combobox', { name: 'Readonly' });
  const multiple = page.getByRole('combobox', { name: 'Multiple' });
  await expect(disabled).toBeDisabled({ timeout: 30_000 });
  await expect(readonly).toHaveAttribute('data-readonly', '');
  await readonly.click();
  await expect(readonly).toHaveAttribute('aria-expanded', 'false');
  await expect(multiple).toHaveText('React');
  await multiple.click();
  await page.getByRole('option', { name: 'Solid' }).click();
  await expect(multiple).toContainText('React');
  await expect(multiple).toContainText('Solid');
  expect(
    await page.getByTestId('select-states-form').evaluate(
      /** Read all selected native values, including multiple entries. */
      (form) => new FormData(form as HTMLFormElement).getAll('multiple'),
    ),
  ).toEqual(['react', 'solid']);
}

test('Select preserves disabled, readonly, and multiple states', verifiesSelectStates);
