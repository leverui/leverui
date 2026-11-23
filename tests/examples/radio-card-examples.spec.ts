import { expect, test, type Page } from '@playwright/test';

const storyIds = [
  'basic',
  'centered',
  'composition',
  'addon',
  'colors',
  'custom-indicator',
  'icon',
  'sizes',
  'variants',
  'without-indicator',
  'without-indicator-vertical',
  'responsive-orientation',
  'description',
  'controlled',
] as const;

/** Require every named Radio Card story to show a radio group. */
async function verifiesEveryRadioCardExample({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-radio-card--${id}`);
    await expect(page.getByRole('radiogroup').first()).toBeVisible();
  }
}

/** Check the default framework selection and explanatory variants. */
async function verifiesFrameworkCards({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card--basic');
  const group = page.getByRole('radiogroup', { name: 'Select framework' });
  await expect(group.getByRole('radio')).toHaveCount(3);
  await expect(group.getByRole('radio', { name: 'Next.js' })).toBeChecked();
  await group.getByText('Vite', { exact: true }).click();
  await expect(group.getByRole('radio', { name: 'Vite' })).toBeChecked();

  await page.goto('/iframe.html?id=components-radio-card--description');
  await expect(page.getByText('Best for static sites')).toBeVisible();
  await page.goto('/iframe.html?id=components-radio-card--addon');
  await expect(page.getByText('Free and open source')).toHaveCount(3);
}

/** Follow the controlled example's Solid signal. */
async function verifiesControlled({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card--controlled');
  const group = page.getByRole('radiogroup', { name: 'Select framework' });
  await expect(group.getByRole('radio', { name: 'Next.js' })).toBeChecked();
  await group.getByText('Astro', { exact: true }).click();
  await expect(group.getByRole('radio', { name: 'Astro' })).toBeChecked();
}

/** Check the attached composition and selected custom SVG. */
async function verifiesCompositionAndIndicator({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card--composition');
  const group = page.getByRole('radiogroup');
  await expect(group.getByRole('radio')).toHaveCount(3);
  await group.getByText('Intermediate', { exact: true }).click();
  await expect(group.getByRole('radio', { name: /Intermediate/ })).toBeChecked();

  await page.goto('/iframe.html?id=components-radio-card--custom-indicator');
  const indicatorGroup = page.getByRole('radiogroup', { name: 'Select framework' });
  const selected = page.locator('.lui-radio-card__itemIndicator svg.lucide-check');
  await expect(selected).toHaveCount(1);
  await indicatorGroup.getByText('Vite', { exact: true }).click();
  await expect(indicatorGroup.getByRole('radio', { name: 'Vite' })).toBeChecked();
  await expect(selected).toHaveCount(1);
}

/** Verify the palette, size, and variant matrices. */
async function verifiesMatrices({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card--colors');
  await expect(page.getByRole('radiogroup')).toHaveCount(10);
  await expect(page.getByRole('radio')).toHaveCount(20);

  await page.goto('/iframe.html?id=components-radio-card--sizes');
  await expect(page.getByRole('radiogroup')).toHaveCount(3);
  await expect(page.getByText(/size =/)).toHaveCount(3);

  await page.goto('/iframe.html?id=components-radio-card--variants');
  await expect(page.getByRole('radiogroup')).toHaveCount(4);
  await expect(page.getByText(/variant =/)).toHaveCount(4);
}

/** Check centered icons, permission copy, and payment selection. */
async function verifiesIconCards({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card--centered');
  await expect(page.getByRole('radio')).toHaveCount(3);
  await expect(page.locator('span.lui-icon')).toHaveCount(3);
  await expect(page.locator('span.lui-icon').first()).toHaveCSS('font-size', '24px');
  await expect(page.locator('span.lui-icon').first()).toHaveCSS('margin-bottom', '8px');

  await page.goto('/iframe.html?id=components-radio-card--icon');
  await expect(page.getByText('This user cannot sign in to the app')).toBeVisible();
  await expect(page.locator('span.lui-icon')).toHaveCount(3);
  await expect(page.locator('span.lui-icon').first()).toHaveCSS('margin-bottom', '8px');

  await page.goto('/iframe.html?id=components-radio-card--without-indicator');
  await page.getByText('Mobile pay', { exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Mobile pay' })).toBeChecked();
  await expect(page.locator('.lui-radio-card__itemIndicator')).toHaveCount(0);
  await expect(page.locator('span.lui-icon').first()).toHaveCSS('font-size', '24px');

  await page.goto('/iframe.html?id=components-radio-card--without-indicator-vertical');
  await expect(page.getByRole('radio')).toHaveCount(3);
  await expect(page.locator('span.lui-icon').first()).toHaveCSS('font-size', '24px');
}

/** Follow the breakpoint in the responsive payment story. */
async function verifiesResponsiveOrientation({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/iframe.html?id=components-radio-card--responsive-orientation');
  const group = page.getByRole('radiogroup');
  await expect(group).toHaveAttribute('aria-orientation', 'horizontal');
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(group).toHaveAttribute('aria-orientation', 'vertical');
  await expect(group.getByRole('radio')).toHaveCount(3);
}

test('all Radio Card examples render', verifiesEveryRadioCardExample);
test('Radio Card framework choices and descriptions work', verifiesFrameworkCards);
test('Radio Card controlled selection works', verifiesControlled);
test('Radio Card composition and custom indicator work', verifiesCompositionAndIndicator);
test('Radio Card palette, size, and variant matrices render', verifiesMatrices);
test('Radio Card icon and payment examples work', verifiesIconCards);
test('Radio Card responsive orientation follows the viewport', verifiesResponsiveOrientation);
