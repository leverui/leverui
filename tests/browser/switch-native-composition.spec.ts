import { expect, test, type Page } from '@playwright/test';

/** Verify selected native tags retain refs, CSS hooks, and machine behavior. */
async function verifiesNativeSwitchComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch--native-composition');
  const root = page.getByTestId('switch-native-root');
  const control = page.getByTestId('switch-native-control');
  const input = root.getByRole('checkbox', { name: 'Native selection' });
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveJSProperty('tagName', 'LABEL');
  await expect(control).toHaveJSProperty('tagName', 'DIV');
  await expect(root).toHaveAttribute('data-root-ref', 'true');
  await expect(control).toHaveAttribute('data-control-ref', 'true');
  await expect(root).toHaveClass(/leverui-switch__root/);
  await expect(control).toHaveClass(/leverui-switch__control/);
  await expect(control).toHaveCSS('width', '48px');
  await expect(input).not.toBeChecked();
  await control.click();
  await expect(input).toBeChecked();
  await input.focus();
  await input.press('Space');
  await expect(input).not.toBeChecked();
}

test('Switch native composition forwards tags and refs', verifiesNativeSwitchComposition);
