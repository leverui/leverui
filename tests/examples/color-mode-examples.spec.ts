import { expect, test, type Page } from '@playwright/test';

const storyIds = ['basic', 'forced', 'icon-button', 'value', 'value-fallback'] as const;

/** Require each Color Mode story to mount a visible control. */
async function verifiesEveryColorModeExample({ page }: { page: Page }): Promise<void> {
  for (const id of storyIds) {
    await page.goto(`/iframe.html?id=components-color-mode--${id}`);
    await expect(page.locator('#storybook-root button').first()).toBeVisible();
  }
}

/** Check that the basic and icon controls toggle the root mode. */
async function verifiesColorModeToggles({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-color-mode--basic');
  await expect(page.locator('html')).toHaveAttribute('data-leverui-color-mode', 'light');
  await page.getByRole('button', { name: 'Toggle mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-leverui-color-mode', 'dark');

  await page.goto('/iframe.html?id=components-color-mode--icon-button');
  const button = page.getByRole('button', { name: 'Toggle color mode' });
  const lightIcon = await button.locator('svg').innerHTML();
  await expect(button.locator('svg')).toHaveCSS('width', '20px');
  await button.click();
  await expect(page.locator('html')).toHaveAttribute('data-leverui-color-mode', 'dark');
  await expect(button.locator('svg')).not.toHaveJSProperty('innerHTML', lightIcon);
}

/** Keep forced scopes stable while the parent mode changes. */
async function verifiesForcedScopes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-color-mode--forced');
  const scopes = page.locator('#storybook-root [data-leverui-theme]');
  await expect(scopes).toHaveCount(2);
  await expect(scopes.nth(0)).toHaveAttribute('data-leverui-color-mode', 'light');
  await expect(scopes.nth(1)).toHaveAttribute('data-leverui-color-mode', 'dark');
  await page.getByRole('button', { name: 'Toggle mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-leverui-color-mode', 'dark');
  await expect(scopes.nth(0)).toHaveAttribute('data-leverui-color-mode', 'light');
  await expect(scopes.nth(1)).toHaveAttribute('data-leverui-color-mode', 'dark');
}

/** Change the value box colors and fallback icon on mode toggles. */
async function verifiesModeValues({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-color-mode--value');
  const box = page.getByText('This box changes color when you switch the color mode.');
  await expect(page.locator('html')).toHaveAttribute('data-leverui-color-mode', 'light');
  await expect(box).toHaveCSS('padding', '8px');
  const initialBackground = await box.evaluate(
    /** Read the browser-resolved color instead of an implementation class. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await page.getByRole('button', { name: 'Toggle mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-leverui-color-mode', 'dark');
  await expect
    .poll(
      /** Observe the new resolved background after the Solid signal updates. */
      () =>
        box.evaluate(
          /** Read the resolved box color after the mode change. */
          (element) => getComputedStyle(element).backgroundColor,
        ),
    )
    .not.toBe(initialBackground);
  await page.addStyleTag({ content: ':root { --leverui-spacing-2: 12px; }' });
  await expect(box).toHaveCSS('padding', '12px');

  await page.goto('/iframe.html?id=components-color-mode--value-fallback');
  await page.getByRole('button', { name: 'Toggle color mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-leverui-color-mode', 'dark');
}

test('all Color Mode examples render', verifiesEveryColorModeExample);
test('Color Mode controls toggle the root theme', verifiesColorModeToggles);
test('forced light and dark scopes stay fixed', verifiesForcedScopes);
test('mode values and fallback control respond', verifiesModeValues);
