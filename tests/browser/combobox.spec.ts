import { expect, test, type Page } from '@playwright/test';

/** Verify popup selection, form values, Field semantics, and live CSS choices. */
async function verifiesComboboxBrowser({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-combobox--contract');
  const input = page.getByTestId('combobox-input');
  const root = page.getByTestId('combobox-root');
  const trigger = page.getByTestId('combobox-trigger');
  await expect(input).toHaveAttribute('role', 'combobox', { timeout: 30_000 });
  await expect(input).toHaveAttribute('required', '');
  await expect(input).toHaveAttribute('aria-describedby', /helper-text/);
  await expect(input).toHaveCSS('min-height', '36px');
  await expect(root).toHaveClass(/leverui-combobox__root/);
  await trigger.click();
  await expect(page.getByTestId('open-state')).toHaveText('open');
  await page.evaluate(
    /** Check root-scoped variables reach the input and portalled popup. */
    () => document.documentElement.style.setProperty('--lui-combobox-radius', '17px'),
  );
  await expect(input).toHaveCSS('border-radius', '17px');
  await expect(page.getByTestId('combobox-content')).toHaveCSS('border-radius', '17px');
  const controlBounds = await page.getByTestId('combobox-control').boundingBox();
  const popupBounds = await page.getByTestId('combobox-content').boundingBox();
  if (!controlBounds || !popupBounds) throw new Error('Open Combobox geometry is missing.');
  expect(popupBounds.x).toBeGreaterThanOrEqual(controlBounds.x - 1);
  expect(popupBounds.y).toBeGreaterThanOrEqual(controlBounds.y + controlBounds.height - 1);
  const solid = page.getByRole('option', { name: 'Solid' });
  await expect(solid).toBeVisible();
  await solid.click();
  await expect(input).toHaveValue('Solid');
  await expect(page.getByTestId('selected-value')).toHaveText('solid');
  const formValue = await page.getByTestId('combobox-form').evaluate(
    /** Read the actual native form entry after the primitive selects an item. */
    (form) => new FormData(form as HTMLFormElement).get('framework'),
  );
  expect(formValue).toBe('Solid');
  await input.evaluate(
    /** Mark the original input before changing its CSS choices. */
    (element) => element.setAttribute('data-original-input', 'true'),
  );
  await page.getByTestId('toggle-presentation').click();
  await expect(input).toHaveCSS('min-height', '48px');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAttribute('aria-describedby', /error-text/);
  await expect(input).toHaveAttribute('data-original-input', 'true');
  await expect(input).toHaveValue('Solid');
}

test(
  'Combobox selects and submits while CSS choices and Field state update',
  verifiesComboboxBrowser,
);

/** Verify filtering, empty state, and keyboard option selection. */
async function verifiesComboboxFiltering({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-combobox--contract');
  const input = page.getByTestId('combobox-input');
  await expect(input).toHaveAttribute('role', 'combobox', { timeout: 30_000 });
  await input.fill('zz');
  await expect(page.getByText('No matching frameworks')).toBeVisible();
  await expect(page.getByRole('option')).toHaveCount(0);
  await input.fill('Vue');
  await expect(page.getByRole('option', { name: 'Vue' })).toBeVisible();
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(page.getByTestId('selected-value')).toHaveText('vue');
  await expect(input).toHaveValue('Vue');
}

test('Combobox filters and selects from the keyboard', verifiesComboboxFiltering);

/** A native label click must move browser focus to the machine input. */
async function verifiesComboboxLabelFocus({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-combobox--contract');
  const input = page.getByTestId('combobox-input');
  await expect(input).toHaveAttribute('role', 'combobox', { timeout: 30_000 });
  await page.getByText('Framework', { exact: true }).click();
  await expect(input).toBeFocused();
}

test('Combobox label focuses its input', verifiesComboboxLabelFocus);
