import { expect, test, type Page } from '@playwright/test';

/** Verify Explorer metadata, decorative checks, and native radio selection. */
async function verifiesExplorer({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-explorer--explorer');
  const root = page.getByTestId('guide-radio-card-explorer');
  const radios = root.getByRole('radio');
  await expect(radios).toHaveCount(3);
  await expect(root.getByText('Great for full-stack web apps')).toBeVisible();
  await expect(root.getByText('Super fast dev server')).toBeVisible();
  await expect(radios.first()).toBeChecked();
  await expect(root.locator('svg[data-icon="check"]')).toHaveCount(1);
  await root.getByText('Vite', { exact: true }).click();
  await expect(radios.nth(1)).toBeChecked();
  await expect(root.locator('svg[data-icon="check"]')).toHaveCount(1);
  expect(
    await root.evaluate(
      /** Read the selected value from the native radio input. */
      (element) => (element.querySelector('input:checked') as HTMLInputElement | null)?.value,
    ),
  ).toBe('vite');
}

test('Radio Card Explorer selects a described framework', verifiesExplorer);
