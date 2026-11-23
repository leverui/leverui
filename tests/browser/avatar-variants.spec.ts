import { expect, test, type Locator, type Page } from '@playwright/test';

const sizes = [
  ['2xs', '24px'],
  ['xs', '32px'],
  ['sm', '36px'],
  ['md', '40px'],
  ['lg', '44px'],
  ['xl', '48px'],
  ['2xl', '64px'],
] as const;

/** Select a document color mode for the mapped semantic palette. */
function setColorMode(mode: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-lui-color-mode', mode);
}

/** Measure how far a group's second Avatar is offset from its first. */
async function horizontalOffset(first: Locator, second: Locator): Promise<number> {
  const firstBounds = await first.boundingBox();
  const secondBounds = await second.boundingBox();
  if (!firstBounds || !secondBounds) throw new Error('Avatar group roots are not visible.');
  return Math.round(secondBounds.x - firstBounds.x);
}

/** Check the blue palette's Avatar surfaces in one color mode. */
async function verifyBluePalette(page: Page, mode: 'light' | 'dark'): Promise<void> {
  await page.evaluate(setColorMode, mode);
  const solid = page.getByTestId('avatar-variant-solid');
  const subtle = page.getByTestId('avatar-variant-subtle');
  const outline = page.getByTestId('avatar-variant-outline');
  await expect(solid).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(solid).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(subtle).toHaveCSS(
    'background-color',
    mode === 'light' ? 'rgb(191, 219, 254)' : 'rgb(26, 52, 120)',
  );
  await expect(subtle).toHaveCSS(
    'color',
    mode === 'light' ? 'rgb(23, 61, 166)' : 'rgb(163, 207, 255)',
  );
  await expect(outline).toHaveCSS(
    'color',
    mode === 'light' ? 'rgb(23, 61, 166)' : 'rgb(163, 207, 255)',
  );
  await expect(outline).toHaveCSS(
    'border-top-color',
    mode === 'light' ? 'rgb(59, 130, 246)' : 'rgb(96, 165, 250)',
  );
}

/** Verify stock size, shape, surface, group, and responsive CSS. */
async function verifiesAvatarVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-avatar-variants--matrix');
  await expect(page.getByTestId('avatar-size-matrix')).toBeVisible({ timeout: 30_000 });
  await verifyBluePalette(page, 'light');
  for (const [size, width] of sizes) {
    await expect(page.getByTestId(`avatar-size-${size}`)).toHaveCSS('width', width);
  }
  await expect(page.getByTestId('avatar-size-full')).toHaveCSS('width', '80px');
  await expect(page.getByTestId('avatar-shape-square')).toHaveCSS('border-radius', '0px');
  await expect(page.getByTestId('avatar-shape-rounded')).toHaveCSS('border-radius', '6px');
  await expect(page.getByTestId('avatar-shape-full')).toHaveCSS('border-radius', '9999px');
  const outline = page.getByTestId('avatar-variant-outline');
  await expect(outline).toHaveCSS('border-top-width', '1px');
  await expect(page.getByTestId('avatar-bordered-first')).toHaveCSS('border-top-width', '2px');
  await expect(page.getByTestId('avatar-borderless-first')).toHaveCSS('border-top-width', '0px');
  await expect(page.getByTestId('avatar-bordered-first')).toHaveCSS('margin-inline-start', '0px');
  await expect(page.getByTestId('avatar-bordered-last')).toHaveCSS('margin-inline-start', '-12px');
  await expect
    .poll(
      /** Wait for the group's item binding before measuring its overlap. */
      () =>
        horizontalOffset(
          page.getByTestId('avatar-bordered-first'),
          page.getByTestId('avatar-bordered-last'),
        ),
    )
    .toBe(28);
  await verifyBluePalette(page, 'dark');
  await page.setViewportSize({ width: 600, height: 700 });
  await expect(page.getByTestId('avatar-responsive')).toHaveCSS('width', '36px');
  const responsiveTreatment = page.getByTestId('avatar-responsive-treatment');
  await expect(responsiveTreatment).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(responsiveTreatment).toHaveCSS('border-radius', '0px');
  await expect(responsiveTreatment).toHaveCSS('border-top-width', '0px');
  await expect(page.getByTestId('avatar-responsive-border-first')).toHaveCSS(
    'border-top-width',
    '0px',
  );
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(page.getByTestId('avatar-responsive')).toHaveCSS('width', '44px');
  await expect(responsiveTreatment).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(responsiveTreatment).toHaveCSS('border-radius', '6px');
  await expect(responsiveTreatment).toHaveCSS('border-top-width', '1px');
  await expect(page.getByTestId('avatar-responsive-border-first')).toHaveCSS(
    'border-top-width',
    '2px',
  );
}

/** Verify a consumer stylesheet can replace an Avatar palette role in place. */
async function verifiesAvatarCssOverride({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-avatar-variants--matrix');
  const solid = page.getByTestId('avatar-variant-solid');
  await expect(solid).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await page.addStyleTag({
    content:
      '[data-testid="avatar-variant-solid"] { --lui-colors-color-palette-solid: rgb(18 52 86); }',
  });
  await expect(solid).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await page.addStyleTag({
    content: '[data-testid="avatar-bordered-group"] { --lui-avatar-group-overlap: 0px; }',
  });
  await expect(page.getByTestId('avatar-bordered-last')).toHaveCSS('margin-inline-start', '0px');
  const unstyled = page.getByTestId('avatar-unstyled');
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyled.locator('.lui-avatar__fallback')).toHaveAttribute('data-unstyled', '');
  await page.addStyleTag({ content: '.consumer-avatar { width: 73px; display: flex; }' });
  await expect(unstyled).toHaveCSS('width', '73px');
}

test('Avatar stock CSS variants and group borders resolve in Chromium', verifiesAvatarVariants);
test('Avatar honors a consumer CSS palette override', verifiesAvatarCssOverride);
