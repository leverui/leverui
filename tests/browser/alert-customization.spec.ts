import { expect, test, type Page } from '@playwright/test';

/** Verify recipe variants, sizing, and explicit palette overrides in Chromium. */
async function verifiesAlertVariants({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=feedback-alert--contract');
  const subtle = page.getByTestId('alert-default');
  const solid = page.getByTestId('alert-error');
  const outline = page.getByTestId('alert-outline');
  const surface = page.getByTestId('alert-surface');
  const palette = page.getByTestId('alert-custom-palette');
  const responsive = page.getByTestId('alert-responsive');
  const responsiveStatus = page.getByTestId('alert-responsive-status');
  await expect(subtle).toBeVisible({ timeout: 15_000 });
  await expect(subtle).toHaveCSS('padding', '16px');
  await expect(subtle).toHaveCSS('gap', '12px');
  await expect(solid).toHaveCSS('font-size', '12px');
  await expect(outline).toHaveCSS('font-size', '16px');
  await expect(outline).toHaveCSS('box-shadow', /inset/);
  await expect(surface).toHaveCSS('box-shadow', /inset/);
  await expect(palette).not.toHaveCSS('background-color', 'rgb(219, 234, 254)');
  await expect(responsive).toHaveCSS('font-size', '12px');
  await expect(responsiveStatus).toHaveAttribute('data-status-md', 'success');
  await expect(responsiveStatus).not.toHaveAttribute('data-lui-private-style-runtime');
  await expect(responsiveStatus).toHaveCSS(
    'background-color',
    await page.getByTestId('alert-default').evaluate(
      /** Compare against the mounted static info status. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
  );
  await expect(responsive).toHaveAttribute('data-variant-md', 'solid');
  await expect(responsive).toHaveAttribute('data-inline-md', 'true');
  await expect(responsive).toHaveCSS('box-shadow', /inset/);
  await expect(page.getByTestId('alert-responsive-content')).toHaveCSS('flex-direction', 'column');
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(responsive).toHaveCSS('font-size', '16px');
  await expect(responsiveStatus).toHaveCSS(
    'background-color',
    await page.getByTestId('alert-success').evaluate(
      /** Compare against the mounted static success status. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
  );
  await expect(responsive).toHaveCSS('box-shadow', /inset/);
  await expect(page.getByTestId('alert-responsive-content')).toHaveCSS('flex-direction', 'row');
}

test('Alert variants, custom palette, and responsive size render', verifiesAlertVariants);

/** Verify nearest color scopes and public CSS variable customization. */
async function verifiesAlertThemeScopes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=feedback-alert--contract');
  const dark = page.getByTestId('alert-scope-dark');
  const light = page.getByTestId('alert-scope-light');
  await expect(dark).toHaveCSS('background-color', 'rgb(20, 32, 74)');
  await expect(light).toHaveCSS('background-color', 'rgb(219, 234, 254)');
  await page.evaluate(
    /** Change the document mode while explicit nested scopes stay fixed. */
    () => document.documentElement.setAttribute('data-lui-color-mode', 'dark'),
  );
  await expect(dark).toHaveCSS('background-color', 'rgb(20, 32, 74)');
  await expect(light).toHaveCSS('background-color', 'rgb(219, 234, 254)');
  await page.addStyleTag({
    content: '[data-testid="alert-scope-dark"] { --lui-colors-blue-subtle: rgb(18 52 86); }',
  });
  await expect(dark).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await expect(light).toHaveCSS('background-color', 'rgb(219, 234, 254)');
}

test('Alert honors nearest Theme scope and consumer CSS', verifiesAlertThemeScopes);
