import { expect, test, type Page } from '@playwright/test';

/** Apply a theme-level size without touching the chart instance. */
function setRootBarSegmentSize(): void {
  document.documentElement.style.setProperty('--lui-bar-segment-size', '3rem');
}

/** Verify authored CSS, consumer hooks, native style, and reactive geometry. */
async function verifiesBarSegmentCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=charts-barsegment-styles--basic');
  const root = page.locator('.consumer-bar-segment');
  const segment = root.locator('.leverui-bar-segment__segment');
  const reference = root.locator('.leverui-bar-segment__reference');
  const second = segment.nth(1);
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('id', 'bar-segment-native-root');
  await expect(root).toHaveAttribute('aria-label', 'Traffic channels');
  await expect(root).toHaveAttribute('data-ref', 'bound');
  await expect(root.locator('.leverui-bar-segment__content')).toHaveAttribute(
    'id',
    'bar-segment-native-content',
  );
  await expect(root.locator('.leverui-bar-segment__value')).toHaveAttribute(
    'id',
    'bar-segment-native-value',
  );
  await expect(root.locator('.leverui-bar-segment__bar')).toHaveAttribute(
    'aria-label',
    'Channel segments',
  );
  await expect(root.locator('.leverui-bar-segment__bar')).toHaveAttribute('data-ref', 'bound');
  await expect(reference).toHaveAttribute('id', 'bar-segment-native-reference');
  await expect(root.locator('.leverui-bar-segment__label')).toHaveAttribute(
    'id',
    'bar-segment-native-label',
  );
  await expect(root.locator('.leverui-bar-segment__legend')).toHaveAttribute(
    'id',
    'bar-segment-native-legend',
  );
  await expect(root).toHaveCSS('width', '360px');
  await expect(root).toHaveCSS('gap', '16px');
  await expect(root.locator('.leverui-bar-segment__value')).toHaveCSS('gap', '8px');
  await expect(segment.first()).toHaveCSS('height', '40px');
  await expect(reference).toHaveAttribute('data-has-label', '');
  await expect(reference).toHaveCSS('height', '60px');
  await page.evaluate(setRootBarSegmentSize);
  await expect(segment.first()).toHaveCSS('height', '48px');
  await expect(segment.first()).toHaveCSS('border-radius', '9px');
  await expect(second).toHaveCSS('--lui-private-bar-segment-flex', '50 1 0');
  await expect(root.locator('.leverui-bar-segment__legend')).toHaveCSS('font-size', '12px');
  await expect(root.locator('.leverui-bar-segment__legend')).toHaveCSS('gap', '12px');
  await page.getByTestId('segment-data-toggle').click();
  await expect(second).toHaveCSS('--lui-private-bar-segment-flex', '80 1 0');
  await page.getByTestId('segment-size-toggle').click();
  await expect(segment.first()).toHaveCSS('height', '56px');
  await segment.first().focus();
  await expect(root.getByRole('tooltip')).toContainText('Google');
  await segment.first().hover();
  await page.getByTestId('segment-size-toggle').hover();
  await expect(root.locator('.leverui-bar-segment__content')).toHaveAttribute('data-left', 'true');
  await expect(root.getByRole('tooltip')).toHaveCount(0);
}

test('Bar Segment uses authored CSS and native reactive values', verifiesBarSegmentCss);
