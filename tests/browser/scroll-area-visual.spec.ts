import { expect, test, type Page } from '@playwright/test';

const referenceWidths = { xs: '4px', sm: '6px', md: '8px', lg: '12px' } as const;

/** Compare measured slots with the sizes and tokens. */
async function verifiesReferenceSizes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-visual--sizes');
  for (const [size, width] of Object.entries(referenceWidths)) {
    const root = page.getByTestId(`size-${size}-root`);
    const viewport = page.getByTestId(`size-${size}-viewport`);
    const scrollbar = page.getByTestId(`size-${size}-scrollbar`);
    const thumb = scrollbar.locator('[data-scroll-area-thumb]');
    await expect(root).toHaveCSS('display', 'flex');
    await expect(root).toHaveCSS('overflow', 'hidden');
    await expect(viewport).toHaveCSS('scrollbar-width', 'none');
    await expect(scrollbar).toHaveCSS('width', width);
    await expect(scrollbar).toHaveCSS('margin-top', '2px');
    await expect(scrollbar).toHaveCSS('opacity', '1');
    await expect(thumb).toHaveCSS('border-top-left-radius', '9999px');
    const trackColor = await scrollbar.evaluate(
      /** Read the recipe's ten-percent track color. */
      (element) => getComputedStyle(element).backgroundColor,
    );
    expect(trackColor).toMatch(/\/ 0\.1\)/);
    const colors = await thumb.evaluate(
      /** Read the source recipe's gray solid thumb and track tokens. */
      (element) => ({
        palette: getComputedStyle(element).getPropertyValue('--leverui-colors-color-palette-solid'),
        thumb: getComputedStyle(element).getPropertyValue('--leverui-private-scroll-area-thumb-bg'),
      }),
    );
    expect(colors.palette.trim()).toBe('#18181b');
    expect(colors.thumb).toContain('25%');
  }
}

test('ScrollArea sizes and slots match the recipe', verifiesReferenceSizes);

/** Verify responsive size and visibility update without remounting Zag. */
async function verifiesResponsiveVariants({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=components-scroll-area-visual--responsive');
  const root = page.getByTestId('responsive-scroll-root');
  const scrollbar = page.getByTestId('responsive-scrollbar');
  await expect(scrollbar).toHaveCSS('width', '4px');
  await expect(scrollbar).toHaveCSS('opacity', '0');
  await root.evaluate(
    /** Mark the live machine root across the media-query change. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(scrollbar).toHaveCSS('width', '12px');
  await expect(scrollbar).toHaveCSS('opacity', '1');
  await expect(root).toHaveAttribute('data-original-root', 'true');
}

test('ScrollArea CSS choices respond to viewport width', verifiesResponsiveVariants);

/** Compare horizontal and two-direction track geometry with the recipe. */
async function verifiesTrackDirections({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-layout--horizontal');
  await expect(page.getByTestId('horizontal-scrollbar')).toHaveCSS('height', '4px');
  await page.goto('/iframe.html?id=components-scroll-area-layout--both-directions');
  await expect(page.getByTestId('vertical-scrollbar')).toHaveCSS('width', '6px');
  await expect(page.getByTestId('horizontal-scrollbar')).toHaveCSS('height', '6px');
  await expect(page.getByTestId('scroll-corner')).toHaveAttribute('data-state', 'visible');
}

test('ScrollArea track geometry matches horizontal and corner states', verifiesTrackDirections);

/** Confirm a consumer stylesheet can change the thumb palette. */
async function verifiesCssThemeOverride({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-layout--basic');
  const thumb = page.getByTestId('scrollbar').locator('[data-scroll-area-thumb]');
  await page.addStyleTag({
    content: ':root { --leverui-colors-gray-solid: rgb(255, 0, 0) !important; }',
  });
  await expect
    .poll(
      /** Wait for the thumb's color transition to finish. */
      () =>
        thumb.evaluate(
          /** Read the thumb color after the consumer override and transition. */
          (element) => getComputedStyle(element).backgroundColor,
        ),
    )
    .toMatch(/color\(srgb 1 0 0 \/ 0\.25\)/);
}

test('ScrollArea thumb follows consumer CSS theme overrides', verifiesCssThemeOverride);

/** Confirm a public variable can adjust track geometry without runtime styles. */
async function verifiesScrollbarVariable({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-scroll-area-layout--basic');
  const scrollbar = page.getByTestId('scrollbar');
  await page.addStyleTag({
    content: '.leverui-scroll-area__root { --leverui-scroll-area-scrollbar-size: 14px; }',
  });
  await expect(scrollbar).toHaveCSS('width', '14px');
}

test('ScrollArea geometry follows a consumer CSS variable', verifiesScrollbarVariable);
