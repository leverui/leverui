import { expect, test, type Page } from '@playwright/test';

const exampleIds = [
  'basic',
  'controlled',
  'sizes',
  'variants',
  'actions',
  'avatar',
  'disabled-item',
  'expanded-style',
  'icon',
  'multiple',
  'subtext',
] as const;

/** Require each named Accordion example to mount a real component. */
async function verifiesEveryAccordionExample({ page }: { page: Page }): Promise<void> {
  test.setTimeout(240_000);
  for (const id of exampleIds) {
    await page.goto(`/iframe.html?id=components-accordion--${id}`);
    await expect(
      page.locator('[data-accordion-root]').first(),
      `Accordion example ${id} should render`,
    ).toBeVisible({ timeout: 45_000 });
  }
  await page.goto('/iframe.html?id=components-accordion--actions');
  await expect(page.locator('.accordion-rich-actions > [data-accordion-item]').nth(1)).toHaveCSS(
    'margin-top',
    '16px',
  );
  await expect(page.locator('.accordion-rich-action-host').first()).toHaveCSS(
    'position',
    'relative',
  );
  await page.goto('/iframe.html?id=components-accordion--icon');
  await expect(page.locator('.accordion-rich-icon').first()).toHaveCSS('font-size', '18px');
}

/** Verify a trigger updates the controlled value and expanded content. */
async function verifiesControlledAccordion({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion--controlled');
  await expect(page.getByText('Expanded: second-item')).toBeVisible();
  await page.getByRole('button', { name: 'First item' }).click();
  await expect(page.getByText('Expanded: first-item')).toBeVisible();
  await expect(page.getByText('Click a title to open its panel.')).toBeVisible();
}

/** Verify that opening another item leaves the first expanded. */
async function verifiesMultipleAccordion({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion--multiple');
  await expect(page.getByText('This panel is open when the page loads.')).toBeVisible();
  await page.getByRole('button', { name: 'First item' }).click();
  await expect(page.getByText('Click a title to open its panel.')).toBeVisible();
  await expect(page.getByText('This panel is open when the page loads.')).toBeVisible();
}

/** Verify the disabled item cannot open. */
async function verifiesDisabledAccordion({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion--disabled-item');
  await expect(page.getByRole('button', { name: 'Third item' })).toBeDisabled();
}

/** Preserve the size and variant counts and three trigger heights. */
async function verifiesRecipeMatrices({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-accordion--sizes');
  const roots = page.locator('[data-accordion-root]');
  await expect(roots).toHaveCount(3);
  for (const [index, height] of [36, 40, 48].entries()) {
    await expect(roots.nth(index).locator('[data-accordion-item-trigger]').first()).toHaveCSS(
      'height',
      `${height}px`,
    );
  }

  await page.goto('/iframe.html?id=components-accordion--variants');
  await expect(roots).toHaveCount(4);
}

test('all Accordion examples render', verifiesEveryAccordionExample);
test('controlled Accordion example updates its value', verifiesControlledAccordion);
test('multiple Accordion example keeps both items open', verifiesMultipleAccordion);
test('disabled Accordion item remains disabled', verifiesDisabledAccordion);
test('Accordion size and variant matrices render every combination', verifiesRecipeMatrices);
