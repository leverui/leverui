import { expect, test, type Page } from '@playwright/test';

/** Verify loading state, replacement text, and custom spinner content. */
async function verifiesLoadingButtons({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-button--loading');
  const buttons = page.locator('#storybook-root button');
  await expect(buttons).toHaveCount(2);
  await expect(buttons.first()).toBeDisabled();
  await expect(buttons.last()).toBeDisabled();
  await expect(buttons.first()).toHaveAttribute('data-loading');
  await expect(buttons.last()).toContainText('Saving...');

  await page.goto('/iframe.html?id=components-button--custom-spinner');
  const custom = page.getByRole('button', { name: /Click me/ });
  await expect(custom).toBeDisabled();
  await expect(custom.locator('[data-beat]')).toHaveCount(3);
}

/** Verify the Button and Checkbox control the same reactive loading state. */
async function verifiesLoadingToggle({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-button--loading-toggle');
  const button = page.getByRole('button', { name: 'Click me' });
  const checkbox = page.getByRole('checkbox', { name: 'Loading' });
  await expect(button).toBeEnabled();
  await expect(checkbox).not.toBeChecked();
  await button.click();
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute('data-loading');
  await expect(checkbox).toBeChecked();
  await page.locator('#storybook-root label[data-checkbox-root]').click();
  await expect(button).toBeEnabled();
}

/** Verify the attached trigger exposes all three actions. */
async function verifiesSplitMenu({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-button--split-menu');
  const trigger = page.getByRole('button', { name: 'Save options' });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  for (const label of ['Save as draft', 'Save and publish', 'Save and schedule']) {
    await expect(page.getByRole('menuitem', { name: label })).toBeVisible();
  }
}

test('Button loading examples preserve spinner and text behavior', verifiesLoadingButtons);
test('Button loading toggle stays in sync with its Checkbox', verifiesLoadingToggle);
test('Button split menu exposes every save action', verifiesSplitMenu);
