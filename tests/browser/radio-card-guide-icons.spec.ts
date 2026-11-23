import { expect, test, type Page } from '@playwright/test';

/** Check permission symbols stay decorative next to named inputs. */
async function verifiesPermissionIcons({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-icons--icon');
  const root = page.getByTestId('guide-radio-card-permission');
  await expect(root.getByRole('radio')).toHaveCount(3);
  await expect(root.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(root.locator('svg[data-icon][aria-hidden="true"]')).toHaveCount(3);
  await expect(root.getByText('This user will be denied access to the system')).toBeVisible();
  await root.getByText('Deny', { exact: true }).click();
  await expect(root.getByRole('radio').nth(1)).toBeChecked();
}

test('Radio Card icon guide combines symbols and descriptions', verifiesPermissionIcons);

/** Check horizontal payment cards omit the indicator entirely. */
async function verifiesNoIndicator({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-icons--no-indicator');
  const root = page.getByTestId('guide-radio-card-payment');
  await expect(root).toHaveAttribute('aria-orientation', 'horizontal');
  await expect(root.getByRole('radio')).toHaveCount(3);
  await expect(root.locator('.lui-radio-card__itemIndicator')).toHaveCount(0);
  await expect(root.locator('svg[data-icon="wallet"]')).toHaveAttribute('fill', 'currentColor');
  await expect(root.locator('svg.lui-icon').first()).toHaveCSS('width', '24px');
  await root.getByText('Mobile pay', { exact: true }).click();
  await expect(root.getByRole('radio').nth(1)).toBeChecked();
}

test('Radio Card horizontal payment guide selects without an indicator', verifiesNoIndicator);

/** Check the same payments render vertical controls. */
async function verifiesNoIndicatorVertical({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-icons--no-indicator-vertical');
  const root = page.getByTestId('guide-radio-card-payment');
  await expect(root).toHaveAttribute('aria-orientation', 'vertical');
  await expect(root.locator('.lui-radio-card__itemControl').first()).toHaveCSS(
    'flex-direction',
    'column',
  );
  await expect(root.locator('.lui-radio-card__itemIndicator')).toHaveCount(0);
}

test('Radio Card vertical payment guide arranges content', verifiesNoIndicatorVertical);

/** Check breakpoint changes update one live radio machine. */
async function verifiesResponsive({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-radio-card-guide-icons--responsive-orientation');
  const root = page.getByTestId('guide-radio-card-payment');
  await expect(root).toHaveAttribute('aria-orientation', 'horizontal');
  await expect(root).toHaveCSS('max-width', '400px');
  await expect(root.locator('svg[data-icon="wallet"]')).toHaveAttribute('fill', 'currentColor');
  await root.getByText('Mobile pay', { exact: true }).click();
  await root.evaluate(
    /** Mark the live machine root before the viewport changes. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(root).toHaveAttribute('aria-orientation', 'vertical');
  await expect(root).toHaveCSS('max-width', '400px');
  await expect(root).toHaveAttribute('data-original-root', 'true');
  await expect(root.getByRole('radio').nth(1)).toBeChecked();
}

test('Radio Card responsive guide retains selection at the breakpoint', verifiesResponsive);

/** Confirm native radio arrow keys work on both sides of the orientation breakpoint. */
async function verifiesOrientationKeys({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-radio-card-guide-icons--responsive-orientation');
  const root = page.getByTestId('guide-radio-card-payment');
  const first = root.getByRole('radio').first();
  const second = root.getByRole('radio').nth(1);

  for (const [width, orientation] of [
    [600, 'horizontal'],
    [900, 'vertical'],
  ] as const) {
    await page.setViewportSize({ width, height: 700 });
    await expect(root).toHaveAttribute('aria-orientation', orientation);
    for (const key of ['ArrowRight', 'ArrowDown'] as const) {
      await root.getByText('Wallet', { exact: true }).click();
      await first.focus();
      await first.press(key);
      await expect(second).toBeChecked();
    }
  }
}

test('Radio Card arrow keys work in both responsive orientations', verifiesOrientationKeys);

/** Check centered contract cards have their icons and native inputs. */
async function verifiesCentered({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-radio-card-guide-icons--centered');
  const root = page.getByTestId('guide-radio-card-centered');
  await expect(root.getByRole('radio')).toHaveCount(3);
  await expect(root.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(root.locator('svg[data-icon]')).toHaveCount(3);
  await expect(root.locator('.lui-radio-card__itemControl').first()).toHaveCSS(
    'flex-direction',
    'column',
  );
}

test('Radio Card centered guide aligns contract choices', verifiesCentered);
