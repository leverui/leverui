import { expect, test, type Page } from '@playwright/test';

const heights = [
  ['xs', '16px', '10px', '12px', '4px'],
  ['sm', '20px', '12px', '16px', '6px'],
  ['md', '24px', '14px', '20px', '8px'],
  ['lg', '28px', '14px', '20px', '10px'],
] as const;

/** Verify all mapped Badge variants and sizes in a browser. */
async function verifiesBadgeVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-badge-variants--matrix');
  const solid = page.getByTestId('badge-variant-solid');
  const subtle = page.getByTestId('badge-variant-subtle');
  const outline = page.getByTestId('badge-variant-outline');
  const surface = page.getByTestId('badge-variant-surface');
  const plain = page.getByTestId('badge-variant-plain');
  const defaultBadge = page.getByTestId('badge-default');
  await expect(defaultBadge).toHaveCSS('display', 'inline-flex');
  await expect(defaultBadge).toHaveCSS('align-items', 'center');
  await expect(defaultBadge).toHaveCSS('border-radius', '4px');
  await expect(defaultBadge).toHaveCSS('gap', '4px');
  await expect(defaultBadge).toHaveCSS('font-weight', '500');
  await expect(defaultBadge).toHaveCSS('font-variant-numeric', 'tabular-nums');
  await expect(defaultBadge).toHaveCSS('white-space', 'nowrap');
  await expect(defaultBadge).toHaveCSS('user-select', 'none');
  await expect(defaultBadge).toHaveCSS('font-size', '12px');
  await expect(defaultBadge).toHaveCSS('padding-left', '6px');
  await expect(defaultBadge).toHaveCSS('min-height', '20px');
  await expect(defaultBadge).toHaveCSS('background-color', 'rgb(244, 244, 245)');
  await expect(defaultBadge).toHaveCSS('color', 'rgb(39, 39, 42)');
  await expect(solid).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(solid).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(subtle).toHaveCSS('background-color', 'rgb(219, 234, 254)');
  await expect(subtle).toHaveCSS('color', 'rgb(23, 61, 166)');
  await expect(outline).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(outline).toHaveCSS('color', 'rgb(23, 61, 166)');
  await expect(outline).toHaveCSS('box-shadow', /rgb\(59, 130, 246\).*inset/);
  await expect(surface).toHaveCSS('background-color', 'rgb(219, 234, 254)');
  await expect(surface).toHaveCSS('color', 'rgb(23, 61, 166)');
  await expect(surface).toHaveCSS('box-shadow', /rgb\(191, 219, 254\).*inset/);
  await expect(plain).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(plain).toHaveCSS('color', 'rgb(23, 61, 166)');
  for (const [size, height, fontSize, lineHeight, padding] of heights) {
    const badge = page.getByTestId(`badge-size-${size}`);
    await expect(badge).toHaveCSS('min-height', height);
    await expect(badge).toHaveCSS('font-size', fontSize);
    await expect(badge).toHaveCSS('line-height', lineHeight);
    await expect(badge).toHaveCSS('padding-left', padding);
    await expect(badge).toHaveCSS('padding-right', padding);
  }
  await expect(page.getByTestId('badge-icon')).toHaveCSS('gap', '4px');
  await expect(page.getByTestId('badge-icon').locator('svg')).toBeVisible();
  await expect(page.getByTestId('badge-green')).toHaveCSS('background-color', 'rgb(22, 163, 74)');
  await page.evaluate(
    /** Select the mapped palette's dark document color mode. */
    () => document.documentElement.setAttribute('data-leverui-color-mode', 'dark'),
  );
  await expect(subtle).toHaveCSS('background-color', 'rgb(20, 32, 74)');
  await expect(subtle).toHaveCSS('color', 'rgb(163, 207, 255)');
  await expect(solid).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(outline).toHaveCSS('box-shadow', /rgb\(96, 165, 250\).*inset/);
  await expect(surface).toHaveCSS('box-shadow', /rgb\(26, 52, 120\).*inset/);
  await page.setViewportSize({ width: 600, height: 700 });
  await expect(page.getByTestId('badge-responsive')).toHaveCSS('min-height', '16px');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(page.getByTestId('badge-responsive')).toHaveCSS('min-height', '28px');
}

/** Verify consumer CSS can override a public Badge palette role. */
async function verifiesBadgeCssOverride({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-badge-variants--matrix');
  const badge = page.getByTestId('badge-css-override');
  await expect(badge).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await page.addStyleTag({
    content:
      '[data-testid="badge-css-override"] { --lui-colors-color-palette-solid: rgb(18 52 86); }',
  });
  await expect(badge).toHaveCSS('background-color', 'rgb(18, 52, 86)');
}

test('Badge variants, palettes, and responsive sizes resolve in Chromium', verifiesBadgeVariants);
test('Badge honors consumer CSS palette overrides', verifiesBadgeCssOverride);

/** Verify Badge palette tokens follow the nearest explicit Theme scope. */
async function verifiesBadgeThemeScopes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-badge-variants--matrix');
  const dark = page.getByTestId('badge-scope-dark');
  const light = page.getByTestId('badge-scope-light');
  await expect(dark).toHaveCSS('background-color', 'rgb(20, 32, 74)');
  await expect(dark).toHaveCSS('color', 'rgb(163, 207, 255)');
  await expect(light).toHaveCSS('background-color', 'rgb(219, 234, 254)');
  await expect(light).toHaveCSS('color', 'rgb(23, 61, 166)');
  await page.evaluate(
    /** Invert the document mode while explicit nested scopes remain fixed. */
    () => document.documentElement.setAttribute('data-leverui-color-mode', 'dark'),
  );
  await expect(dark).toHaveCSS('background-color', 'rgb(20, 32, 74)');
  await expect(light).toHaveCSS('background-color', 'rgb(219, 234, 254)');
  await page.addStyleTag({
    content: '[data-testid="badge-dark-scope"] { --lui-colors-blue-subtle: rgb(18 52 86); }',
  });
  await expect(dark).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await expect(light).toHaveCSS('background-color', 'rgb(219, 234, 254)');
}

/** Verify attached Group gives adjacent Badges joined edges and separate palettes. */
async function verifiesAttachedBadgeGroup({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-badge-variants--matrix');
  const group = page.getByTestId('badge-attached-group');
  const blue = page.getByTestId('badge-group-blue');
  const green = page.getByTestId('badge-group-green');
  await expect(group).toHaveCSS('gap', '0px');
  await expect(blue).toHaveAttribute('data-leverui-group-first', '');
  await expect(green).toHaveAttribute('data-leverui-group-last', '');
  await expect(blue).toHaveCSS('border-top-right-radius', '0px');
  await expect(green).toHaveCSS('border-top-left-radius', '0px');
  await expect(blue).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(green).toHaveCSS('background-color', 'rgb(22, 163, 74)');
}

test('Badge follows nested Theme modes and scoped CSS overrides', verifiesBadgeThemeScopes);
test('Badge joins edges inside an attached Group', verifiesAttachedBadgeGroup);
