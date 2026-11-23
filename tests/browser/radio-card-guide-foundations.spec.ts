import { expect, test, type Page } from '@playwright/test';

/** Check the basic cards and native arrow-key selection. */
async function verifiesBasic({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-foundations--basic');
  const root = page.getByTestId('guide-radio-card-basic');
  const radios = root.getByRole('radio');
  await expect(radios).toHaveCount(3);
  await expect(radios.first()).toBeChecked();
  await radios.first().focus();
  await radios.first().press('ArrowRight');
  await expect(radios.nth(1)).toBeChecked();
}

test('Radio Card basic guide preserves native keyboard selection', verifiesBasic);

/** Check each described item keeps its explanatory text accessible. */
async function verifiesDescriptions({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-foundations--description');
  const root = page.getByTestId('guide-radio-card-description');
  await expect(root.getByText('Best for apps')).toBeVisible();
  await expect(root.getByText('Best for SPAs')).toBeVisible();
  await expect(root.getByText('Best for static sites')).toBeVisible();
  await expect(root.getByRole('radio')).toHaveCount(3);
}

test('Radio Card description guide exposes each detail', verifiesDescriptions);

/** Check size examples have independent native values. */
async function verifiesSizes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-foundations--sizes');
  for (const size of ['sm', 'md', 'lg']) {
    const root = page.getByTestId(`guide-radio-card-size-${size}`);
    await expect(root.getByRole('radio')).toHaveCount(2);
    await expect(root.getByRole('radio').first()).toBeChecked();
  }
  const small = page
    .getByTestId('guide-radio-card-size-sm')
    .locator('.lui-radio-card__itemControl')
    .first();
  const large = page
    .getByTestId('guide-radio-card-size-lg')
    .locator('.lui-radio-card__itemControl')
    .first();
  const smallPadding = await small.evaluate(
    /** Read the compact card's computed spacing. */
    (element) => getComputedStyle(element).paddingTop,
  );
  const largePadding = await large.evaluate(
    /** Read the large card's computed spacing. */
    (element) => getComputedStyle(element).paddingTop,
  );
  expect(smallPadding).not.toBe(largePadding);
}

test('Radio Card sizes guide renders three independent groups', verifiesSizes);

/** Check all ten palette scopes remain selectable. */
async function verifiesColors({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-foundations--colors');
  const palettes = [
    'gray',
    'red',
    'green',
    'blue',
    'teal',
    'pink',
    'purple',
    'cyan',
    'orange',
    'yellow',
  ];
  for (const palette of palettes) {
    const root = page.getByTestId(`guide-radio-card-color-${palette}`);
    await expect(root.getByRole('radio')).toHaveCount(2);
    await expect(root.getByRole('radio').first()).toBeChecked();
    await expect(root.getByText('Select Framework')).toBeVisible();
  }
  const redBorder = await page
    .getByTestId('guide-radio-card-color-red')
    .locator('.lui-radio-card__item')
    .first()
    .evaluate(
      /** Read the selected red palette border. */
      (element) => getComputedStyle(element).borderTopColor,
    );
  const blueBorder = await page
    .getByTestId('guide-radio-card-color-blue')
    .locator('.lui-radio-card__item')
    .first()
    .evaluate(
      /** Read the selected blue palette border. */
      (element) => getComputedStyle(element).borderTopColor,
    );
  expect(redBorder).not.toBe(blueBorder);
}

test('Radio Card colors guide renders ten palettes', verifiesColors);

/** Check the four variants preserve selected input state. */
async function verifiesVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-foundations--variants');
  for (const variant of ['surface', 'subtle', 'outline', 'solid']) {
    const root = page.getByTestId(`guide-radio-card-variant-${variant}`);
    await expect(root.getByRole('radio')).toHaveCount(2);
    await expect(root.getByRole('radio').first()).toBeChecked();
  }
  const outline = await page
    .getByTestId('guide-radio-card-variant-outline')
    .locator('.lui-radio-card__item')
    .first()
    .evaluate(
      /** Read the selected outline card's background. */
      (element) => getComputedStyle(element).backgroundColor,
    );
  const solid = await page
    .getByTestId('guide-radio-card-variant-solid')
    .locator('.lui-radio-card__item')
    .first()
    .evaluate(
      /** Read the selected solid card's background. */
      (element) => getComputedStyle(element).backgroundColor,
    );
  expect(solid).not.toBe(outline);
}

test('Radio Card variants guide renders four treatments', verifiesVariants);

/** Check the owner signal follows a selected controlled card. */
async function verifiesControlled({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-foundations--controlled');
  const root = page.getByTestId('guide-radio-card-controlled');
  await root.getByText('Vite', { exact: true }).click();
  await expect(root.getByRole('radio').nth(1)).toBeChecked();
  await expect(page.getByTestId('guide-radio-card-controlled-value')).toHaveText('vite');
}

test('Radio Card controlled guide synchronizes its Solid signal', verifiesControlled);
