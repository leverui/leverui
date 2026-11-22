import { expect, test, type Page } from '@playwright/test';

/** Verify the primitive's region semantics and Lever UI's visible toast styling. */
async function verifiesToastAppearance({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-toast--contract');
  await page.getByTestId('toast-success').click();
  const root = page.getByTestId('toast-root');
  await expect(root).toBeVisible({ timeout: 15_000 });
  await expect(root).toHaveAttribute('data-type', 'success');
  await expect(root).toHaveCSS('display', 'flex');
  await expect(page.getByTestId('toast-region')).toHaveAttribute('role', 'region');
  await expect(page.getByTestId('toast-region')).toHaveAttribute('aria-live', 'polite');
  const indicator = page.getByTestId('toast-indicator');
  await expect(indicator).toHaveAttribute('aria-hidden', 'true');
  expect(
    await indicator.evaluate(
      /** Inspect the rendered native indicator rather than its wrapper. */
      (element) => element.tagName.toLowerCase(),
    ),
  ).toBe('svg');
  await expect(indicator).toHaveCSS('width', '20px');
  await expect(indicator).toHaveCSS('height', '20px');
  await expect(page.getByText('Saved', { exact: true })).toBeVisible();
  await expect(page.getByText('Your work is saved')).toBeVisible();
  await expect(page.getByTestId('toast-action')).toBeVisible();
  await page.getByTestId('toast-action').click();
  await expect(page.locator('body')).toHaveAttribute('data-toast-action', 'undo');
}

test('Toast renders an accessible styled notification and action', verifiesToastAppearance);

/** Verify store updates, placement, queue size, and dismissal in Chromium. */
async function verifiesToastLifecycle({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-toast--contract');
  const region = page.getByTestId('toast-region');
  await expect(region).toHaveAttribute('data-placement', 'bottom-end');
  await page.getByTestId('toast-error').click();
  await expect(page.getByText('Could not save')).toBeVisible();
  await page.getByTestId('toast-update').click();
  await expect(page.getByText('Updated')).toBeVisible();
  await page.getByTestId('toast-success').click();
  await expect(page.getByTestId('toast-root')).toHaveCount(2);
  await page.getByTestId('toast-close').last().click();
  await expect(page.getByTestId('toast-root')).toHaveCount(1);
  await page.getByTestId('toast-dismiss').click();
  await expect(page.getByTestId('toast-root')).toHaveCount(0);
}

test('Toast updates and dismisses notifications in the selected region', verifiesToastLifecycle);

/** Remove presentation transitions when the user requests reduced motion. */
async function verifiesReducedMotion({ page }: { page: Page }): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=feedback-toast--contract');
  await page.getByTestId('toast-success').click();
  await expect(page.getByTestId('toast-root')).toHaveCSS('transition-duration', '0s');
  await expect(page.getByTestId('toast-action')).toHaveCSS('transition-duration', '0s');
}

test('Toast respects reduced motion', verifiesReducedMotion);

/** Keep the composition entirely inside a narrow viewport. */
async function verifiesMobileGeometry({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/iframe.html?id=feedback-toast--contract');
  await page.getByTestId('toast-success').click();
  const bounds = await page.getByTestId('toast-root').boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds?.x).toBeGreaterThanOrEqual(0);
  expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(320);
  await expect(page.getByTestId('toast-action')).toBeInViewport();
}

test('Toast composition fits a mobile viewport', verifiesMobileGeometry);
