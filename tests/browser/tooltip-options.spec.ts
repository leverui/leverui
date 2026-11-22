import { expect, test, type Page } from '@playwright/test';

/** Verify disabled Tooltip remains closed on pointer and keyboard focus. */
async function verifiesDisabledTooltip({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip-options--disabled');
  const trigger = page.getByTestId('disabled-tooltip-trigger');
  const content = page.getByTestId('disabled-tooltip-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.hover();
  await expect(content).toHaveCount(0);
  await trigger.focus();
  await expect(content).toHaveCount(0);
}

test('Tooltip remains closed when disabled', verifiesDisabledTooltip);

/** Preserve the machine's explicit opt out of Escape dismissal. */
async function verifiesEscapeOption({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip-options--escape-persistent');
  const trigger = page.getByTestId('escape-tooltip-trigger');
  const content = page.getByTestId('escape-tooltip-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await trigger.hover();
  await expect(content).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(content).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(content).toHaveCount(0);
}

test('Tooltip honors closeOnEscape false', verifiesEscapeOption);

/** Verify the public RootProvider uses a caller-owned machine and presence. */
async function verifiesTooltipProvider({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip-options--provider');
  const content = page.getByTestId('provider-tooltip-content');
  await expect(page.getByTestId('provider-tooltip-trigger')).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveCount(1);
  await expect(content).toBeHidden();
  await page.getByTestId('provider-tooltip-toggle').click();
  await expect(content).toBeVisible();
  await page.getByTestId('provider-tooltip-toggle').click();
  await expect(content).toBeHidden();
}

test('Tooltip RootProvider accepts a caller-owned machine', verifiesTooltipProvider);
