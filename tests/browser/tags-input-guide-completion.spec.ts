import { expect, test, type Locator, type Page } from '@playwright/test';
import { settleTagFrame } from './tags-input-guide-frame';

/** Read one tag's visible custom fill from the browser. */
function tagFill(element: HTMLElement): string {
  const preview = element.querySelector('[data-tags-input-item-preview]');
  if (!preview) throw new Error('Tags Input item preview is missing.');
  return getComputedStyle(preview).backgroundColor;
}

/** Enter a tag only after the machine exposes its cleared input state. */
async function enterTag(input: Locator, value: string): Promise<void> {
  await expect(input).toHaveValue('');
  await input.pressSequentially(value);
  await expect(input).toHaveValue(value);
  await input.press('Enter');
  await input.evaluate(settleTagFrame);
  await expect(input).toHaveValue('');
}

/** Keep guide colors attached to each live tag value and its index. */
async function verifiesColors({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-guide-colors--contract');
  const root = page.getByTestId('tags-guide-colors-control');
  const items = root.locator('[data-tags-input-item]');
  await expect(items).toHaveCount(3, { timeout: 30_000 });
  await expect(items.locator('[data-tags-input-item-text]')).toHaveText([
    'SolidJS',
    'Lever UI',
    'TypeScript',
  ]);
  const original = await Promise.all([
    items.nth(0).evaluate(tagFill),
    items.nth(1).evaluate(tagFill),
    items.nth(2).evaluate(tagFill),
  ]);
  expect(new Set(original).size).toBe(3);
  const input = page.getByPlaceholder('Add colored tag');
  await input.fill('Solid');
  await input.press('Enter');
  await expect(items).toHaveCount(4);
  await expect(items.last().locator('[data-tags-input-item-text]')).toHaveText('Solid');
  const added = await items.last().evaluate(tagFill);
  expect(added).not.toBe('rgba(0, 0, 0, 0)');
  const highlightedPreview = items.last().locator('.tags-input-colored-preview');
  await highlightedPreview.click();
  await expect(highlightedPreview).toHaveAttribute('data-highlighted', '');
  await expect(highlightedPreview).toHaveCSS('filter', 'brightness(0.9)');
  await items.nth(1).getByRole('button', { name: 'Delete tag Lever UI' }).click();
  await expect(items.locator('[data-tags-input-item-text]')).toHaveText([
    'SolidJS',
    'TypeScript',
    'Solid',
  ]);
  expect(await items.nth(1).evaluate(tagFill)).toBe(original[2]);
}

test('Tags Input guide colors follow live tag values', verifiesColors);

/** Submit the composed Field form through the native hidden tag input. */
async function verifiesForm({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-guide-form--contract');
  const form = page.getByTestId('tags-guide-form');
  const title = page.getByRole('textbox', { name: 'Title' });
  const categories = page.getByPlaceholder('Add category');
  await expect(categories).toHaveAccessibleDescription('Add frameworks and libraries you use', {
    timeout: 30_000,
  });
  await title.fill('Component library');
  await enterTag(categories, 'Solid');
  await expect(form.locator('[data-tags-input-item-text]')).toHaveText('Solid');
  await enterTag(categories, 'Vitest');
  await expect(form.locator('[data-tags-input-item-text]')).toHaveText(['Solid', 'Vitest']);
  await page.getByRole('button', { name: 'Submit categories' }).click();
  const result = await page.getByTestId('tags-guide-form-result').textContent();
  if (!result) throw new Error('Tags Input form produced no result.');
  const submitted = JSON.parse(result) as { title: string; categories: string };
  expect(submitted.title).toBe('Component library');
  expect(submitted.categories).toContain('Solid');
  expect(submitted.categories).toContain('Vitest');
}

test('Tags Input composes Field help and native form values', verifiesForm);

/** Clear a caller-owned Tags Input machine from outside its root. */
async function verifiesStore({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-guide-store--contract');
  const output = page.getByTestId('tags-guide-store-value');
  await expect(output).toHaveText('["SolidJS","Lever UI"]', { timeout: 30_000 });
  await page.getByRole('button', { name: 'Clear all stored tags' }).click();
  await expect(output).toHaveText('[]');
  const input = page.getByPlaceholder('Add stored tag');
  await expect(input).toBeFocused();
  await enterTag(input, 'Solid');
  await expect(output).toHaveText('["Solid"]');
}

test('Tags Input guide store controls its root externally', verifiesStore);

/** Select a suggested tag through the shared Combobox and Tags Input field. */
async function verifiesCombobox({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tags-input-guide-combobox--contract');
  const root = page.getByTestId('tags-guide-combobox-root');
  const tagTexts = root.locator('[data-tags-input-item-text]');
  const input = page.getByPlaceholder('Add suggested tag');
  await expect(input).toBeVisible({ timeout: 30_000 });
  await expect(input).toHaveAttribute('role', 'combobox');
  await expect(input).toHaveAccessibleName('Tags');
  const popup = page.getByRole('listbox', { name: 'Tags' });
  await expect(root.locator('input:not([type="hidden"])')).toHaveCount(1);
  await input.fill('Type');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(popup).toBeVisible();
  const labelId = await popup.getAttribute('aria-labelledby');
  expect(labelId).toBeTruthy();
  await expect(root.locator(`[id="${labelId}"]`)).toHaveText('Tags');
  const suggestion = page.getByTestId('suggestion-TypeScript');
  await expect(suggestion).toBeVisible();
  await expect(page.getByTestId('suggestion-React')).toHaveCount(0);
  await suggestion.click();
  await expect(tagTexts).toHaveText('TypeScript');
  await input.fill('Vitest');
  await expect(page.getByTestId('suggestion-Vitest')).toBeVisible();
  await page.getByTestId('suggestion-Vitest').click();
  await expect(tagTexts).toHaveText(['TypeScript', 'Vitest']);
  await input.fill('Next');
  await expect(page.getByTestId('suggestion-Next.js')).toBeVisible();
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(tagTexts).toHaveText(['TypeScript', 'Vitest', 'Next.js']);
}

test('Tags Input accepts filtered Combobox suggestions', verifiesCombobox);
