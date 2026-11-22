import { expect, test, type Page } from '@playwright/test';

/** Check attached choices retain descriptions and native radio state. */
async function verifiesComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-composition--composition');
  const root = page.getByTestId('guide-radio-card-composition');
  await expect(root.getByRole('radio')).toHaveCount(3);
  await expect(root.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(root.getByText('I can hack simple things')).toBeVisible();
  await root.getByText('Professional', { exact: true }).click();
  await expect(root.getByRole('radio').nth(1)).toBeChecked();
}

test('Radio Card attached Group guide selects a described card', verifiesComposition);

/** Check every described card has its guide metadata strip. */
async function verifiesAddon({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-composition--addon');
  const root = page.getByTestId('guide-radio-card-addon');
  await expect(root.locator('.leverui-radio-card__itemAddon')).toHaveCount(3);
  await expect(root.getByText('Some addon text')).toHaveCount(3);
  await expect(root.getByRole('radio')).toHaveCount(3);
}

test('Radio Card addon guide keeps metadata on each option', verifiesAddon);

/** Check the closed composition forwards its input ref and form value. */
async function verifiesClosed({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-closed--closed-component');
  const form = page.getByTestId('guide-radio-card-closed-form');
  await expect(form.getByRole('radio')).toHaveCount(3);
  await form.getByText('Vite', { exact: true }).click();
  await expect(form.getByRole('radio').nth(1)).toBeChecked();
  await form.getByRole('button', { name: 'Inspect input ref' }).click();
  await expect(page.getByTestId('guide-radio-card-closed-ref')).toHaveText('INPUT');
  expect(
    await form.evaluate(
      /** Read the selected native form field from the closed composition. */
      (element) => new FormData(element as HTMLFormElement).get('framework'),
    ),
  ).toBe('vite');
}

test('Radio Card closed guide forwards its native input', verifiesClosed);
