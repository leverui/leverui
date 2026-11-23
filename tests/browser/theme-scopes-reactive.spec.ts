import { expect, test, type Page } from '@playwright/test';

/** Check mode changes in a Solid scope and its portalled bridge. */
async function verifiesReactivePortal({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-theme-scopes--reactive-portal');

  const scope = page.getByTestId('reactive-scope');
  const portalScope = page.getByTestId('portal-scope');
  const portalBox = page.getByTestId('portal-box');

  await expect(scope).toBeVisible({ timeout: 30_000 });
  await expect(scope).toHaveAttribute('data-lui-color-mode', 'dark');
  await expect(portalScope).toHaveJSProperty('tagName', 'SECTION');
  await expect(portalScope).toHaveAttribute('data-as-child', 'true');
  await expect(portalScope).toHaveAttribute('data-lui-color-mode', 'dark');
  await expect(page.getByTestId('reactive-box')).toHaveCSS('background-color', 'rgb(9, 9, 11)');
  await expect(portalBox).toHaveCSS('color', 'rgb(239, 68, 68)');
  await expect(portalScope.getByTestId('portal-box')).toHaveCount(1);
  await expect(portalScope).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(scope.getByTestId('portal-box')).toHaveCount(0);

  await page.getByRole('button', { name: 'Toggle appearance' }).click();

  await expect(scope).toHaveAttribute('data-lui-color-mode', 'light');
  await expect(portalScope).toHaveAttribute('data-lui-color-mode', 'light');
  await expect(page.getByTestId('reactive-box')).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)',
  );
  await expect(portalBox).toHaveCSS('color', 'rgb(59, 130, 246)');
}

test('Theme reacts across a portalled scope bridge', verifiesReactivePortal);
