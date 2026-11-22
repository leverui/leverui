import { expect, test, type Page } from '@playwright/test';

/** Verify menu behavior survives the styled Breadcrumb button composition. */
async function verifiesBreadcrumbMenu({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-breadcrumb-menu--composition');
  const trigger = page.getByTestId('breadcrumb-menu-trigger');
  const content = page.getByTestId('breadcrumb-menu-content');
  await expect(trigger).toBeVisible({ timeout: 30_000 });
  await expect(trigger).toHaveJSProperty('tagName', 'BUTTON');
  await expect(trigger).toHaveAttribute('type', 'button');
  await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
  await expect(trigger).toHaveAttribute('data-menu-ref', 'true');
  await expect(trigger).toHaveAttribute('data-link-ref', 'true');
  await expect(trigger).toHaveClass(/breadcrumb__link/);
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(content).toBeVisible();
  await expect(content).toHaveAttribute('role', 'menu');
  await expect(content).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(content).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
}

test(
  'Breadcrumb link composes with Menu trigger and returns keyboard focus',
  verifiesBreadcrumbMenu,
);
