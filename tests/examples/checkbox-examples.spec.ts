import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'controlled',
  'sizes',
  'variants',
  'size-matrix',
  'variant-matrix',
  'colors',
  'custom-icon',
  'description',
  'form',
  'group',
  'group-hook-form',
  'hook-form',
  'indeterminate',
  'link',
  'states',
  'store',
  'label-position',
] as const;

/** Require each named Checkbox story to render an input. */
async function verifiesEveryCheckboxExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(300_000);
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-checkbox--${id}`);
    await expect(
      page.locator('[data-checkbox-root]').first(),
      `Checkbox example ${id} should render`,
    ).toBeVisible({ timeout: 90_000 });
  }
}

/** Verify the controlled example follows its visible label. */
async function verifiesControlledSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox--controlled');
  const input = page.getByRole('checkbox', { name: 'Accept terms and conditions' });
  await expect(input).not.toBeChecked();
  await page.getByText('Accept terms and conditions', { exact: true }).click();
  await expect(input).toBeChecked();
}

/** Verify a partial weekday choice sets the parent to its mixed state. */
async function verifiesIndeterminateSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox--indeterminate');
  const parent = page.locator('[data-checkbox-root]').filter({
    hasText: 'Weekdays',
  });
  await page.getByText('Monday', { exact: true }).click();
  await expect(parent).toHaveAttribute('data-state', 'indeterminate');
  await page.getByText('Weekdays', { exact: true }).click();
  for (const label of ['Monday', 'Tuesday', 'Wednesday', 'Thursday']) {
    await expect(page.getByRole('checkbox', { name: label })).toBeChecked();
  }
}

/** Verify empty submission shows the error and selection updates values. */
async function verifiesGroupedForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox--group-hook-form');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('You must select at least one framework.')).toBeVisible();
  await page.locator('[data-checkbox-label]').filter({ hasText: 'SolidJS' }).click();
  await expect(page.getByRole('checkbox', { name: 'SolidJS' })).toBeChecked();
  await expect(page.getByText('You must select at least one framework.')).toHaveCount(0);
  await expect(page.locator('#storybook-root code')).toContainText('"solid"');
}

/** Verify Toggle and Reset update the displayed controlled form value. */
async function verifiesSingleForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox--hook-form');
  const input = page.getByRole('checkbox', { name: 'Enable notifications' });
  await page.getByRole('button', { name: 'Toggle' }).click();
  await expect(input).toBeChecked();
  await expect(page.getByText('Checked: true')).toBeVisible();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(input).not.toBeChecked();
}

/** Keep the size, variant, and color matrix instances. */
async function verifiesAppearanceMatrices({ page }: { page: Page }): Promise<void> {
  for (const [story, count] of [
    ['size-matrix', 80],
    ['variant-matrix', 90],
    ['colors', 60],
  ] as const) {
    await page.goto(`/iframe.html?id=components-checkbox--${story}`);
    await expect(page.locator('[data-checkbox-root]')).toHaveCount(count);
  }
}

/** Verify fixed example spacing now comes from ordinary CSS classes. */
async function verifiesExampleCss({ page }: { page: Page }): Promise<void> {
  test.setTimeout(120_000);
  await page.goto('/iframe.html?id=components-checkbox--description');
  const root = page.locator('[data-checkbox-root]').first();
  await expect(root).toHaveClass(/checkbox-example-description/, { timeout: 90_000 });
  await expect(root).toHaveCSS('align-items', 'flex-start');
  await expect(root).toHaveCSS('gap', '16px');
  await expect(page.locator('.checkbox-example-description-copy')).toHaveCSS('font-size', '14px');

  await page.goto('/iframe.html?id=components-checkbox--indeterminate');
  await expect(page.locator('.checkbox-example-weekday').first()).toHaveCSS(
    'margin-inline-start',
    '24px',
  );
}

test('all Checkbox examples render', verifiesEveryCheckboxExample);
test('controlled Checkbox follows label clicks', verifiesControlledSelection);
test('indeterminate Checkbox coordinates weekday selection', verifiesIndeterminateSelection);
test('grouped Checkbox form validates and shows its value', verifiesGroupedForm);
test('single Checkbox form toggles and resets', verifiesSingleForm);
test('Checkbox appearance matrices preserve all combinations', verifiesAppearanceMatrices);
test('Checkbox example presentation comes from CSS', verifiesExampleCss);
