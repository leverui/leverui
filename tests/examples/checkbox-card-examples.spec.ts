import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'description',
  'disabled',
  'states',
  'addon',
  'icon',
  'variants',
  'sizes',
  'variant-matrix',
  'size-matrix',
  'group',
  'no-indicator',
] as const;

/** Require each Checkbox Card story to show a selectable card. */
async function verifiesEveryCheckboxCardExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(600_000);
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-checkbox-card--${id}`);
    await expect(
      page.locator('[data-checkbox-root].lui-checkbox-card').first(),
      `Checkbox Card example ${id} should render`,
    ).toBeVisible({ timeout: 90_000 });
  }
}

/** Verify the first grouped card starts selected and sibling selection works. */
async function verifiesGroupedSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox-card--group');
  const next = page.getByRole('checkbox', { name: 'Next.js' });
  const vite = page.getByRole('checkbox', { name: 'Vite' });
  await expect(next).toBeChecked();
  await expect(vite).not.toBeChecked();
  await page.locator('[data-checkbox-label]').filter({ hasText: 'Vite' }).click();
  await expect(vite).toBeChecked();
  await expect(next).toBeChecked();
}

/** Verify disabled cards cannot change their checked state. */
async function verifiesDisabledState({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox-card--disabled');
  const checkbox = page.getByRole('checkbox', { name: 'Disabled' });
  await expect(checkbox).toBeDisabled();
  await expect(checkbox).not.toBeChecked();
}

/** Verify the icon group's Guest default and independent card changes. */
async function verifiesIconGroupSelection({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox-card--icon');
  const guest = page.getByRole('checkbox', { name: /Guest/ });
  const admin = page.getByRole('checkbox', { name: /Admin/ });
  await expect(guest).toBeChecked();
  await expect(admin).not.toBeChecked();
  await page.getByText('Admin', { exact: true }).click();
  await expect(admin).toBeChecked();
  await expect(guest).toBeChecked();
}

/** Preserve the requested visible brand replacement without adding an indicator. */
async function verifiesIndicatorFreeCopy({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox-card--no-indicator');
  await expect(page.getByText('Lever UI', { exact: true })).toBeVisible();
  await expect(page.locator('[data-checkbox-card-indicator]')).toHaveCount(0);
}

/** Match the variant count and compact size-table header. */
async function verifiesAppearanceTables({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-checkbox-card--variant-matrix');
  await expect(page.locator('.lui-checkbox-card')).toHaveCount(120);
  await page.goto('/iframe.html?id=components-checkbox-card--size-matrix');
  await expect(page.locator('.lui-checkbox-card')).toHaveCount(6);
  await expect(page.locator('#storybook-root thead')).toHaveCSS('height', '53px');
}

/** Verify the fixed Card width, group spacing, and icon size. */
async function verifiesExampleCss({ page }: { page: Page }): Promise<void> {
  test.setTimeout(240_000);
  await page.goto('/iframe.html?id=components-checkbox-card--basic');
  const basic = page.locator('.lui-checkbox-card').first();
  await expect(basic).toHaveCSS('max-width', '240px', { timeout: 90_000 });
  await page.goto('/iframe.html?id=components-checkbox-card--group');
  await expect(page.locator('.lui-checkbox-card').first().locator('..')).toHaveCSS('gap', '8px');
  await page.goto('/iframe.html?id=components-checkbox-card--icon');
  await expect(page.locator('#storybook-root svg.lucide').first()).toHaveCSS('font-size', '24px');
}

test('all Checkbox Card examples render', verifiesEveryCheckboxCardExample);
test('grouped Checkbox Cards select independently', verifiesGroupedSelection);
test('disabled Checkbox Card remains disabled', verifiesDisabledState);
test('icon Checkbox Card group preserves its Guest default', verifiesIconGroupSelection);
test('indicator-free Checkbox Card uses the requested visible copy', verifiesIndicatorFreeCopy);
test('Checkbox Card tables match the counts and spacing', verifiesAppearanceTables);
test('Checkbox Card example presentation comes from CSS', verifiesExampleCss);
