import { expect, test, type Page } from '@playwright/test';
import { selectGuideFormValue } from './select-guide-form-value';

/** Verify a selected Avatar and name track the same machine value. */
async function verifiesAvatarSelect({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-guide-avatar--contract');
  const trigger = page.getByTestId('avatar-select-trigger');
  const form = page.getByTestId('avatar-select-form');
  await expect(trigger).toContainText('Jessica Jones', { timeout: 30_000 });
  expect(await form.evaluate(selectGuideFormValue, 'member')).toBe('jessica_jones');
  await trigger.click();
  await page.getByRole('option', { name: 'Kate Wilson' }).click();
  await expect(trigger).toContainText('Kate Wilson');
  await expect(trigger.getByRole('img', { name: 'Kate Wilson' })).toBeVisible();
  await expect(trigger.getByRole('img', { name: 'Kate Wilson' })).toHaveAttribute(
    'src',
    /^data:image\/svg\+xml,/,
  );
  expect(await form.evaluate(selectGuideFormValue, 'member')).toBe('kate_wilson');
}

test('Select composes selected member avatars with form values', verifiesAvatarSelect);

/** Verify country groups, flag text, selection, and native country code. */
async function verifiesCountrySelect({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-guide-country--contract');
  const trigger = page.getByTestId('country-select-trigger');
  const form = page.getByTestId('country-select-form');
  await expect(trigger).toContainText('Nigeria', { timeout: 30_000 });
  expect(await form.evaluate(selectGuideFormValue, 'country')).toBe('NG');
  await trigger.click();
  const content = page.getByTestId('country-select-content');
  await expect(content.locator('[data-select-item-group-label]')).toHaveText([
    'America',
    'Africa',
    'Asia',
    'Europe',
    'Oceania',
  ]);
  const japan = content.getByRole('option', { name: /Japan/ });
  await japan.scrollIntoViewIfNeeded();
  await japan.click();
  await expect(trigger).toContainText('🇯🇵 Japan');
  expect(await form.evaluate(selectGuideFormValue, 'country')).toBe('JP');
}

test('Select groups flagged countries and submits the selected code', verifiesCountrySelect);

/** Verify an icon-only caller button preserves Select trigger semantics. */
async function verifiesIconTrigger({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-select-guide-icon-trigger--contract');
  const trigger = page.getByTestId('icon-select-trigger');
  const form = page.getByTestId('icon-select-form');
  await expect(trigger).toHaveAttribute('role', 'combobox', { timeout: 30_000 });
  await expect(trigger).toHaveAccessibleName('Select framework');
  const bounds = await trigger.boundingBox();
  if (!bounds) throw new Error('Icon-only Select trigger must be visible.');
  expect(bounds.width).toBe(bounds.height);
  const iconPath = trigger.locator('svg[aria-hidden="true"] path');
  await expect(iconPath).toHaveCount(1);
  const initialPath = await iconPath.getAttribute('d');
  expect(initialPath).toBeTruthy();
  await trigger.click();
  await page.getByRole('option', { name: 'Vue.js' }).click();
  await expect(iconPath).not.toHaveAttribute('d', initialPath ?? '');
  expect(await form.evaluate(selectGuideFormValue, 'framework')).toBe('vue');
}

test('Select supports a caller-owned icon-only trigger', verifiesIconTrigger);
