import { expect, test, type Page } from '@playwright/test';

/** Verify native parts, visual variants, and size-dependent spacing. */
async function verifiesCardMatrix({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-card--matrix');
  const outline = page.getByTestId('card-outline');
  await expect(outline).toBeVisible({ timeout: 45_000 });
  await expect(outline).toHaveJSProperty('tagName', 'DIV');
  await expect(outline.locator('h3')).toHaveText('Card title');
  await expect(outline.locator('p')).toHaveText('Card description');
  await expect(outline).toHaveCSS('border-top-width', '1px');
  await expect(outline).toHaveCSS('width', '280px');
  await expect(outline).not.toHaveAttribute('data-leverui-private-style-runtime');
  await expect(page.getByTestId('card-elevated')).toHaveCSS('border-top-width', '0px');
  await expect(page.getByTestId('card-subtle')).toHaveCSS('border-top-width', '0px');
  await expect(page.getByTestId('card-sm-body')).toHaveCSS('padding-top', '16px');
  await expect(page.getByTestId('card-md-body')).toHaveCSS('padding-top', '24px');
  await expect(page.getByTestId('card-lg-body')).toHaveCSS('padding-top', '28px');
  await expect(page.getByTestId('card-sm-title')).toHaveCSS('font-size', '16px');
  await expect(page.getByTestId('card-md-title')).toHaveCSS('font-size', '18px');
  await expect(page.getByTestId('card-lg-title')).toHaveCSS('font-size', '20px');
  await expect(page.getByTestId('card-unstyled')).toHaveCSS('display', 'block');
  await expect(outline).not.toHaveAttribute('size');
  await expect(outline).not.toHaveAttribute('variant');
}

test('Card parts, variants, and sizes render in Chromium', verifiesCardMatrix);

/** Verify changing provider defaults update the mounted Card and its parts. */
async function verifiesReactiveCardSize({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-card--matrix');
  const reactive = page.getByTestId('card-reactive');
  const fixed = page.getByTestId('card-fixed');
  await expect(page.getByTestId('card-reactive-body')).toHaveCSS('padding-top', '16px');
  await expect(page.getByTestId('card-reactive-title')).toHaveCSS('font-size', '16px');
  await expect(reactive).toHaveCSS('border-top-width', '1px');
  await expect(page.getByTestId('card-fixed-body')).toHaveCSS('padding-top', '24px');
  await reactive.evaluate(
    /** Mark the original native Card before the size update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('card-size-toggle').click();
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(page.getByTestId('card-reactive-body')).toHaveCSS('padding-top', '28px');
  await expect(page.getByTestId('card-reactive-title')).toHaveCSS('font-size', '20px');
  await expect(reactive).toHaveCSS('border-top-width', '0px');
  await expect(reactive).not.toHaveCSS('box-shadow', 'none');
  await expect(page.getByTestId('card-fixed-body')).toHaveCSS('padding-top', '24px');
  await expect(page.getByTestId('card-fixed-title')).toHaveCSS('font-size', '18px');
  await expect(fixed).toHaveCSS('border-top-width', '1px');
  await expect(reactive).not.toHaveAttribute('size');
  await expect(fixed).not.toHaveAttribute('size');
}

test('Card size defaults update one mounted root', verifiesReactiveCardSize);

/** Verify responsive size changes both Card body spacing and title scale. */
async function verifiesResponsiveCardSize({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=content-card--matrix');
  const responsive = page.getByTestId('card-responsive');
  await expect(page.getByTestId('card-responsive-body')).toHaveCSS('padding-top', '16px');
  await expect(page.getByTestId('card-responsive-title')).toHaveCSS('font-size', '16px');
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(responsive).toBeVisible();
  await expect(page.getByTestId('card-responsive-body')).toHaveCSS('padding-top', '28px');
  await expect(page.getByTestId('card-responsive-title')).toHaveCSS('font-size', '20px');
  await expect(responsive).not.toHaveAttribute('size');
}

test('Card responsive size follows the viewport', verifiesResponsiveCardSize);
