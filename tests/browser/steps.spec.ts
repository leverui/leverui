import { expect, test, type Page } from '@playwright/test';

/** Exercise the default number, completed check, and content transitions. */
async function verifiesBasicSteps({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-steps--basic');
  const root = page.getByTestId('steps-root');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('steps-indicator-0')).toHaveText('1');
  await expect(page.getByTestId('steps-indicator-1')).toHaveText('2');
  await expect(page.getByText('Account details')).toBeVisible();
  await expect(page.getByTestId('steps-prev')).toBeDisabled();
  await page.getByTestId('steps-next').click();
  await expect(page.getByText('Review details')).toBeVisible();
  await expect(page.getByTestId('steps-indicator-0')).toHaveAttribute('data-complete', '');
  const check = page.getByTestId('steps-indicator-0').locator('svg');
  await expect(check).toHaveCount(1);
  await expect(check.locator('path')).toHaveAttribute('d', 'M20 6 9 17l-5-5');
  await expect(check).toHaveAttribute('stroke-linecap', 'round');
  await expect(check).toHaveAttribute('stroke-linejoin', 'round');
  await expect(check).toHaveCSS('width', '16px');
  await expect(check).toHaveCSS('height', '16px');
  await page.getByTestId('steps-next').click();
  await expect(page.getByText('Complete', { exact: true })).toBeVisible();
  await expect(page.getByTestId('steps-next')).toBeDisabled();
}

test('Steps keeps indicator and content state in sync', verifiesBasicSteps);

/** Check that a caller-owned machine drives vertical presentation and navigation. */
async function verifiesProviderSteps({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-steps--provider');
  const root = page.getByTestId('steps-provider');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-orientation', 'vertical');
  await expect(page.getByText('First panel')).toBeVisible();
  await page.getByTestId('steps-provider-next').click();
  await expect(page.getByText('Second panel')).toBeVisible();
  await expect(root.locator('.leverui-steps__description')).toHaveText('First task');
}

test('Steps provider retains machine state and vertical appearance', verifiesProviderSteps);

/** Verify invalid transitions and controlled updates from a Solid signal. */
async function verifiesControlledSteps({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-steps--controlled');
  const root = page.getByTestId('steps-controlled');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await page.getByTestId('steps-controlled-next').click();
  await expect(page.getByTestId('steps-current-step')).toHaveText('step-0');
  await expect(page.getByTestId('steps-invalid-count')).toHaveText('1');
  await page.getByTestId('steps-validate').click();
  await page.getByTestId('steps-controlled-next').click();
  await expect(page.getByTestId('steps-current-step')).toHaveText('step-1');
  await expect(page.getByText('Done panel')).toBeVisible();
}

test('Steps blocks invalid transitions and updates controlled state', verifiesControlledSteps);
