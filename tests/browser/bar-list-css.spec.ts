import { expect, test, type Page } from '@playwright/test';

/** Apply a theme-level size without touching the chart instance. */
function setRootBarListSize(): void {
  document.documentElement.style.setProperty('--lui-bar-list-size', '44px');
}

/** Verify authored layout, native overrides, focus tooltip, and live size. */
async function verifiesBarListCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=charts-barlist-styles--basic');
  const root = page.locator('.leverui-bar-list__root');
  const content = root.locator('.leverui-bar-list__content');
  const rows = root.locator('.leverui-bar-list__row');
  const fill = root.locator('.leverui-bar-list__fill').first();
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('id', 'bar-list-native-root');
  await expect(root).toHaveAttribute('aria-label', 'Traffic sources');
  await expect(root).toHaveAttribute('data-ref', 'bound');
  await expect(content).toHaveAttribute('id', 'bar-list-native-content');
  await expect(root.locator('.leverui-bar-list__title')).toHaveAttribute(
    'id',
    'bar-list-native-title',
  );
  await expect(root.locator('#bar-list-native-label')).toHaveCSS('min-width', '192px');
  await expect(root.locator('#bar-list-native-label')).toHaveCSS('gap', '8px');
  await expect(root.locator('#bar-list-native-bar')).toHaveAttribute('aria-label', 'Source bars');
  await expect(root.locator('#bar-list-native-bar')).toHaveAttribute('data-ref', 'bound');
  await expect(root.locator('.leverui-bar-list__value')).toHaveAttribute(
    'id',
    'bar-list-native-value',
  );
  await expect(content).toHaveCSS('display', 'flex');
  await expect(content).toHaveCSS('gap', '16px');
  await expect(root.locator('.leverui-bar-list__title')).toHaveCSS('margin-bottom', '16px');
  await expect(root.locator('.leverui-bar-list__labelHeading').first()).toHaveCSS(
    'font-size',
    '12px',
  );
  await expect(root.locator('.consumer-bar')).toHaveCSS('min-width', '180px');
  await expect(rows.first()).toHaveCSS('min-height', '40px');
  await page.evaluate(setRootBarListSize);
  await expect(rows.first()).toHaveCSS('min-height', '44px');
  await expect(root.locator('.leverui-bar-list__valueRow').first()).toHaveCSS('min-height', '44px');
  await expect(fill).toHaveCSS('border-radius', '9px');
  await expect(fill).toHaveCSS('background-color', 'rgb(204, 251, 241)');
  const secondFill = root.locator('.leverui-bar-list__fill').nth(1);
  await expect(secondFill).toHaveCSS('--lui-private-bar-list-width', '50%');
  await page.getByTestId('bar-list-data-toggle').click();
  await expect(secondFill).toHaveCSS('--lui-private-bar-list-width', '80%');
  await rows.first().focus();
  await root.locator('#bar-list-native-bar').hover();
  await expect(root.locator('#bar-list-native-bar')).toHaveAttribute('data-entered', 'true');
  await expect(rows.first()).toHaveAttribute('data-hovered', '');
  await expect(rows.first()).toHaveCSS('background-color', 'rgb(123, 45, 67)');
  await expect(root.locator('.leverui-bar-list__tooltip')).toBeVisible();
  await page.getByTestId('bar-list-size-toggle').click();
  await expect(rows.first()).toHaveCSS('min-height', '48px');
  await page.evaluate(
    /** A theme spacing override must update an existing numeric-token instance. */
    () => document.documentElement.style.setProperty('--lui-spacing-12', '52px'),
  );
  await expect(rows.first()).toHaveCSS('min-height', '52px');
}

test('Bar List uses authored CSS and consumer overrides', verifiesBarListCss);
