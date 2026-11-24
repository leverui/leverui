import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'sizes',
  'variants',
  'colors',
  'controlled',
  'size-matrix',
  'variant-matrix',
  'disabled',
  'hook-form',
  'invalid',
  'thumb-indicator',
  'tooltip',
  'track-indicator',
] as const;

/** Require each named Switch story to render its native control. */
async function verifiesEverySwitchExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(600_000);
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-switch--${id}`);
    await expect(
      page.getByRole('checkbox').first(),
      `Switch example ${id} should render`,
    ).toBeAttached({
      timeout: 30_000,
    });
  }
}

/** Verify the controlled signal follows native switch interaction. */
async function verifiesControlledSwitch({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch--controlled');
  const input = page.getByRole('checkbox');
  await expect(input).not.toBeChecked();
  await page.locator('[data-switch-control]').click();
  await expect(input).toBeChecked();
}

/** Verify the tables contain every palette and recipe option. */
async function verifiesSwitchMatrices({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch--size-matrix');
  await expect(page.locator('#storybook-root table tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root table tbody [data-switch-root]')).toHaveCount(80);
  await page.goto('/iframe.html?id=components-switch--variant-matrix');
  await expect(page.locator('#storybook-root table tbody tr')).toHaveCount(10);
  await expect(page.locator('#storybook-root table tbody [data-switch-root]')).toHaveCount(40);
}

/** Require explicit form choice and retain disabled and invalid semantics. */
async function verifiesSwitchStatesAndForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch--disabled');
  await expect(page.getByRole('checkbox', { name: 'Email notifications' })).toBeDisabled();
  await page.goto('/iframe.html?id=components-switch--invalid');
  await expect(page.getByRole('checkbox', { name: 'Email notifications' })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await page.goto('/iframe.html?id=components-switch--hook-form');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Choose on or off before you submit.')).toBeVisible();
  await page.getByText('Email notifications').click();
  await expect(page.getByRole('checkbox', { name: 'Email notifications' })).toBeChecked();
  await expect(page.getByText('Choose on or off before you submit.')).toHaveCount(0);
}

/** Verify each indicator uses its fallback and checked glyph. */
async function verifiesIndicators({ page }: { page: Page }): Promise<void> {
  for (const [id, before, after, label] of [
    ['thumb-indicator', 'lucide-x', 'lucide-check', 'Auto-save'],
    ['track-indicator', 'lucide-moon', 'lucide-sun', 'Light mode'],
  ] as const) {
    await page.goto(`/iframe.html?id=components-switch--${id}`);
    await expect(page.locator(`.${before}`)).toBeVisible();
    await page.getByText(label).click();
    await expect(page.locator(`.${after}`)).toBeVisible();
  }
}

/** Keep the native checkbox usable while exposing its tooltip on hover. */
async function verifiesTooltip({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch--tooltip');
  await page.getByText('Airplane mode').hover();
  await expect(page.getByRole('tooltip')).toContainText('Turns off Wi-Fi and mobile data');
  await page.getByText('Airplane mode').click();
  await expect(page.getByRole('checkbox', { name: 'Airplane mode' })).toBeChecked();
}

test('all Switch examples render', verifiesEverySwitchExample);
test('controlled Switch updates its checked state', verifiesControlledSwitch);
test('Switch matrices cover every palette and option', verifiesSwitchMatrices);
test('Switch disabled, invalid, and form states work', verifiesSwitchStatesAndForm);
test('Switch indicators follow selection', verifiesIndicators);
test('Switch tooltip opens without blocking selection', verifiesTooltip);
