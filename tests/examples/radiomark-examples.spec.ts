import { expect, test, type Page } from '@playwright/test';

/** Check all Radiomark state combinations. */
async function verifiesRadiomarkStates({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radiomark--basic');
  const marks = page.locator('#storybook-root .lui-radiomark');
  await expect(marks).toHaveCount(4);
  await expect(marks.nth(0)).not.toHaveAttribute('data-checked');
  await expect(marks.nth(1)).toHaveAttribute('data-checked', '');
  await expect(marks.nth(2)).toHaveAttribute('data-disabled', '');
  await expect(marks.nth(3)).toHaveAttribute('data-checked', '');
  await expect(marks.nth(3)).toHaveAttribute('data-disabled', '');
}

/** Check that every variant renders a checked mark. */
async function verifiesRadiomarkVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radiomark--variants');
  await expect(page.locator('#storybook-root .lui-radiomark[data-checked]')).toHaveCount(4);
}

/** Check the states, sizes, palettes, and filled examples. */
async function verifiesRadiomarkGuideExamples({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radiomark--states');
  await expect(page.locator('#storybook-root .lui-radiomark')).toHaveCount(4);
  await page.goto('/iframe.html?id=components-radiomark--sizes');
  await expect(page.locator('#storybook-root .lui-radiomark[data-checked]')).toHaveCount(4);
  await page.goto('/iframe.html?id=components-radiomark--colors');
  await expect(page.locator('#storybook-root .lui-radiomark[data-checked]')).toHaveCount(10);
  await page.goto('/iframe.html?id=components-radiomark--filled');
  await expect(page.locator('#storybook-root .lui-radiomark[data-filled]')).toHaveCount(2);
}

test('Radiomark Basic preserves all four states', verifiesRadiomarkStates);
test('Radiomark Variants renders every variant', verifiesRadiomarkVariants);
test('Radiomark guide examples render', verifiesRadiomarkGuideExamples);
