import { expect, test, type Page } from '@playwright/test';

const exampleIds = [
  'basic',
  'variants',
  'sizes',
  'variant-matrix',
  'size-matrix',
  'avatar',
  'image',
  'horizontal',
  'form',
] as const;

/** Require each named Card example to render a styled Card root. */
async function verifiesEveryCardExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(240_000);
  for (const id of exampleIds) {
    await page.goto(`/iframe.html?id=components-card--${id}`);
    const card = page.locator('[class*="lui-card__root"]').first();
    await expect(card, `Card example ${id} should render`).toBeVisible({ timeout: 45_000 });
    await expect(card).not.toHaveAttribute('data-lui-private-style-runtime');
  }
}

/** Verify the Card tables show all documented sizes and variants. */
async function verifiesCardTables({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-card--variant-matrix');
  await expect(page.locator('#storybook-root thead td')).toHaveCount(3);
  await expect(page.locator('#storybook-root tbody td')).toHaveCount(3);
  await expect(page.locator('#storybook-root thead')).toHaveCSS('height', '53px');
  await expect(page.locator('#storybook-root [class*="card__root"]')).toHaveCount(3);
  await page.goto('/iframe.html?id=components-card--size-matrix');
  await expect(page.locator('#storybook-root thead td')).toHaveCount(4);
  await expect(page.locator('#storybook-root tbody tr')).toHaveCount(3);
  await expect(page.locator('#storybook-root thead')).toHaveCSS('height', '53px');
  await expect(page.locator('#storybook-root [class*="card__root"]')).toHaveCount(9);
}

/** Verify the form card exposes both labeled inputs. */
async function verifiesCardForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-card--form');
  await expect(page.getByRole('textbox', { name: 'First name', exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Last name', exact: true })).toBeVisible();
}

test('all Card examples render', verifiesEveryCardExample);
test('Card tables cover the documented choices', verifiesCardTables);
test('Card signup form labels both fields', verifiesCardForm);

/** Confirm local example CSS preserves the two distinctive root layouts. */
async function verifiesCardExampleCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-card--basic');
  await expect(page.locator('.lui-card__root').first()).toHaveCSS('width', '320px');
  await page.goto('/iframe.html?id=components-card--image');
  await expect(page.locator('.lui-card__root').first()).toHaveCSS('max-width', '384px');
  await expect(page.locator('.card-example-price')).toHaveCSS('font-size', '24px');
  await page.goto('/iframe.html?id=components-card--horizontal');
  await expect(page.locator('.lui-card__root').first()).toHaveCSS('flex-direction', 'row');
  await expect(page.locator('.lui-card__root').first()).toHaveCSS('overflow', 'hidden');
}

test('Card examples use authored CSS for their local layouts', verifiesCardExampleCss);
