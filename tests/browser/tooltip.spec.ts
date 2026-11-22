import { expect, test, type Page } from '@playwright/test';

/** Verify that hover and focus expose the accessible Tooltip surface. */
async function verifiesTooltipOpening({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip--contract');
  const trigger = page.getByTestId('tooltip-trigger');
  const content = page.getByTestId('tooltip-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(content).toHaveCount(0);
  await trigger.hover();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'tooltip');
  await expect(content).toHaveJSProperty('tagName', 'DIV');
  await expect(content).toHaveClass(/tooltip__content/);
  await expect(page.getByTestId('tooltip-arrow').locator('[data-tooltip-arrow-tip]')).toHaveCount(
    1,
  );
  await expect(page.getByTestId('tooltip-open')).toHaveText('true');
  await page.getByTestId('tooltip-outside').hover();
  await expect(content).toHaveCount(0);
  await trigger.focus();
  await expect(content).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
}

test('Tooltip opens accessibly on hover and focus and closes on Escape', verifiesTooltipOpening);

/** Verify controlled state, interactive content, and floating placement. */
async function verifiesControlledTooltip({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-tooltip--controlled');
  const trigger = page.getByTestId('controlled-tooltip-trigger');
  const content = page.getByTestId('controlled-tooltip-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await page.getByTestId('tooltip-toggle').click();
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('data-placement', 'right');
  await expect(content).toHaveCSS('pointer-events', 'auto');
  await page.getByTestId('tooltip-toggle').click();
  await expect(content).toHaveCount(0);
}

test('Tooltip preserves controlled state and interactive placement', verifiesControlledTooltip);
