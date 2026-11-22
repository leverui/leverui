import { expect, test, type Page } from '@playwright/test';

/** Set a dark document mode while nested Theme scopes keep their own modes. */
function setDarkColorMode(): void {
  document.documentElement.setAttribute('data-leverui-color-mode', 'dark');
}

/** Verify visible defaults and all three authored treatments. */
async function verifiesReferenceStyles({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-blockquote-visual--states');
  const base = page.getByTestId('blockquote-default');
  await expect(base).toHaveCSS('display', 'flex');
  await expect(base).toHaveCSS('position', 'relative');
  await expect(base).toHaveCSS('flex-direction', 'column');
  await expect(base).toHaveCSS('gap', '8px');
  await expect(base).toHaveCSS('padding-left', '20px');
  await expect(base).toHaveCSS('padding-right', '20px');
  await expect(base).toHaveCSS('border-left-width', '4px');

  const subtle = page.getByTestId('blockquote-blue-subtle');
  const solid = page.getByTestId('blockquote-blue-solid');
  const plain = page.getByTestId('blockquote-blue-plain');
  await expect(subtle).toHaveCSS('border-left-color', 'rgb(191, 219, 254)');
  await expect(page.getByTestId('blockquote-blue-subtle-icon')).toHaveCSS(
    'color',
    'rgb(23, 61, 166)',
  );
  await expect(solid).toHaveCSS('border-left-color', 'rgb(37, 99, 235)');
  await expect(page.getByTestId('blockquote-blue-solid-icon')).toHaveCSS(
    'color',
    'rgb(37, 99, 235)',
  );
  await expect(plain).toHaveCSS('border-left-width', '0px');
  await expect(plain).toHaveCSS('padding-left', '20px');
  await expect(page.getByTestId('blockquote-blue-plain-icon')).toHaveCSS(
    'color',
    'rgb(37, 99, 235)',
  );
  await expect(page.getByTestId('blockquote-blue-caption')).toHaveCSS('font-size', '14px');
  await expect(page.getByTestId('blockquote-blue-caption')).toHaveCSS('color', 'rgb(82, 82, 91)');
}

test('Blockquote default and palette styles match the reference values', verifiesReferenceStyles);

/** Verify the nearest color scope and unlayered consumer CSS overrides. */
async function verifiesScopesAndOverrides({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-blockquote-visual--states');
  const dark = page.getByTestId('blockquote-dark-subtle');
  const light = page.getByTestId('blockquote-light-subtle');
  await expect(dark).toHaveCSS('border-left-color', 'rgb(26, 52, 120)');
  await expect(page.getByTestId('blockquote-dark-icon')).toHaveCSS('color', 'rgb(163, 207, 255)');
  await expect(page.getByTestId('blockquote-dark-caption')).toHaveCSS(
    'color',
    'rgb(161, 161, 170)',
  );
  await expect(light).toHaveCSS('border-left-color', 'rgb(191, 219, 254)');
  await page.evaluate(setDarkColorMode);
  await expect(page.getByTestId('blockquote-blue-subtle')).toHaveCSS(
    'border-left-color',
    'rgb(26, 52, 120)',
  );
  await expect(light).toHaveCSS('border-left-color', 'rgb(191, 219, 254)');

  await page.addStyleTag({
    content:
      '[data-testid="blockquote-css-override"] { --leverui-colors-color-palette-muted: rgb(12 34 56); --leverui-colors-color-palette-fg: rgb(65 43 21); }',
  });
  await expect(page.getByTestId('blockquote-css-override')).toHaveCSS(
    'border-left-color',
    'rgb(12, 34, 56)',
  );
  await expect(page.getByTestId('blockquote-css-override-icon')).toHaveCSS(
    'color',
    'rgb(65, 43, 21)',
  );
}

test(
  'Blockquote follows nearest light and dark scopes and consumer CSS',
  verifiesScopesAndOverrides,
);

/** Verify logical border placement and part-level unstyled choices. */
async function verifiesLogicalAndUnstyled({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-blockquote-visual--states');
  const rtl = page.getByTestId('blockquote-rtl');
  await expect(rtl).toHaveCSS('border-right-width', '4px');
  await expect(rtl).toHaveCSS('border-left-width', '0px');
  const unstyledIcon = page.getByTestId('blockquote-icon-unstyled');
  const unstyledCaption = page.getByTestId('blockquote-caption-unstyled');
  await expect(unstyledIcon).not.toHaveCSS('width', '20px');
  await expect(unstyledCaption).not.toHaveCSS('font-size', '14px');
}

test(
  'Blockquote uses logical direction and part-level unstyled behavior',
  verifiesLogicalAndUnstyled,
);

/** Prevent an outer authored root from styling an inner unstyled root's parts. */
async function verifiesNestedRootIsolation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-blockquote-visual--states');
  await expect(page.getByTestId('blockquote-outer-caption')).toHaveCSS('font-size', '14px');
  await expect(page.getByTestId('blockquote-nested-caption')).not.toHaveCSS('font-size', '14px');
  await expect(page.getByTestId('blockquote-nested-icon')).not.toHaveCSS('width', '20px');
}

test('nested unstyled Blockquote parts ignore an outer root', verifiesNestedRootIsolation);

/** Verify responsive alignment at both sides of the md breakpoint. */
async function verifiesResponsiveAlignment({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=content-blockquote-visual--states');
  const quote = page.getByTestId('blockquote-responsive');
  await expect(quote).toHaveCSS('align-items', 'flex-start');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(quote).toHaveCSS('align-items', 'flex-end');
}

test('Blockquote responsive justification follows the viewport', verifiesResponsiveAlignment);

/** Verify responsive variants change native CSS without replacing the figure. */
async function verifiesResponsiveVariant({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=content-blockquote-visual--states');
  const quote = page.getByTestId('blockquote-responsive-variant');
  const icon = page.getByTestId('blockquote-responsive-variant-icon');
  await expect(quote).toHaveCSS('border-left-width', '4px');
  await expect(icon).toHaveCSS('color', 'rgb(23, 61, 166)');
  await quote.evaluate(
    /** Mark the original figure before changing the viewport. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(quote).toHaveAttribute('data-original-node', 'true');
  await expect(quote).toHaveCSS('border-left-width', '0px');
  await expect(icon).toHaveCSS('color', 'rgb(37, 99, 235)');
  await page.setViewportSize({ width: 1100, height: 700 });
  await expect(quote).toHaveCSS('border-left-width', '4px');
  await expect(quote).toHaveCSS('border-left-color', 'rgb(37, 99, 235)');
}

test('Blockquote responsive variants follow the viewport', verifiesResponsiveVariant);

/** Verify variant and palette update on a mounted figure and icon. */
async function verifiesReactiveAppearance({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-blockquote-visual--states');
  const quote = page.getByTestId('blockquote-reactive-appearance');
  const icon = page.getByTestId('blockquote-reactive-appearance-icon');
  await expect(quote).toHaveCSS('border-left-color', 'rgb(191, 219, 254)');
  await expect(icon).toHaveCSS('color', 'rgb(23, 61, 166)');
  await quote.evaluate(
    /** Mark the figure before changing both appearance choices. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('blockquote-appearance-toggle').click();
  await expect(quote).toHaveAttribute('data-original-node', 'true');
  await expect(quote).toHaveCSS('border-left-color', 'rgb(22, 163, 74)');
  await expect(icon).toHaveCSS('color', 'rgb(22, 163, 74)');
  await expect(quote).not.toHaveAttribute('variant');
  await expect(quote).not.toHaveAttribute('colorPalette');
}

test('Blockquote updates variant and palette on the same figure', verifiesReactiveAppearance);
