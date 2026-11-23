import { expect, test, type Page } from '@playwright/test';

/** Match the Steps sizes, root gaps, and title text styles. */
async function verifiesSizes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-steps-styles--gallery');
  await expect(page.getByTestId('steps-xs')).toBeVisible({ timeout: 30_000 });
  const sizes = [
    { id: 'steps-xs', indicator: '24px', gap: '10px', title: '14px' },
    { id: 'steps-sm', indicator: '32px', gap: '12px', title: '14px' },
    { id: 'steps-md', indicator: '40px', gap: '16px', title: '14px' },
    { id: 'steps-lg', indicator: '44px', gap: '24px', title: '16px' },
  ] as const;
  for (const size of sizes) {
    const root = page.getByTestId(size.id);
    const indicator = page.getByTestId(`${size.id}-indicator`);
    await expect(root).toHaveCSS('gap', size.gap);
    await expect(indicator).toHaveCSS('width', size.indicator);
    await expect(indicator).toHaveCSS('height', size.indicator);
    await expect(root.locator('.lui-steps__title')).toHaveCSS('font-size', size.title);
  }
}

test('Steps sizes match the dimensions and typography', verifiesSizes);

/** Distinguish both visual variants and palette colors in computed CSS. */
async function verifiesVariantsAndPalettes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-steps-styles--gallery');
  const solid = page.getByTestId('steps-solid-indicator');
  const subtle = page.getByTestId('steps-subtle-indicator');
  await expect(solid).toBeVisible({ timeout: 30_000 });
  await expect(solid).toHaveCSS('border-top-width', '2px');
  await expect(subtle).toHaveCSS('border-top-width', '0px');
  await expect(subtle).toHaveCSS('background-color', 'rgb(228, 228, 231)');
  await expect(page.getByTestId('steps-blue-indicator')).toHaveCSS(
    'border-color',
    'rgb(37, 99, 235)',
  );
  await expect(page.getByTestId('steps-red-indicator')).toHaveCSS(
    'border-color',
    'rgb(220, 38, 38)',
  );
}

test('Steps variants and palettes match colors', verifiesVariantsAndPalettes);

/** Match the horizontal and vertical separator rules from authored CSS. */
async function verifiesSeparatorOrientation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-steps--basic');
  const horizontal = page.getByTestId('steps-root').locator('[data-steps-separator]').first();
  await expect(horizontal).toHaveCSS('height', '2px');
  await expect(horizontal).toHaveCSS('margin-left', '12px');
  await expect(horizontal).toHaveCSS('margin-right', '12px');

  await page.goto('/iframe.html?id=components-steps--provider');
  const vertical = page.getByTestId('steps-provider').locator('[data-steps-separator]').first();
  await expect(vertical).toHaveCSS('position', 'absolute');
  await expect(vertical).toHaveCSS('width', '2px');
}

test('Steps separators match both orientation rules', verifiesSeparatorOrientation);

/** Check that a plain consumer CSS variable wins after the default theme. */
async function verifiesCssOverride({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-steps-styles--css-override');
  const indicator = page.getByTestId('steps-css-override-indicator');
  await expect(indicator).toBeVisible({ timeout: 30_000 });
  await expect(indicator).toHaveCSS('border-color', 'rgb(13, 97, 142)');
}

test('Steps accepts a consumer CSS token override', verifiesCssOverride);

/** Keep one machine and native root while orientation changes reactively. */
async function verifiesReactiveOrientation({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-steps-styles--reactive');
  const root = page.getByTestId('steps-reactive-root');
  const list = page.getByTestId('steps-reactive-list');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-orientation', 'horizontal');
  await expect(root).toHaveCSS('flex-direction', 'column');
  await root.evaluate(
    /** Mark the current root so remounting cannot masquerade as reactivity. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('steps-orientation-toggle').click();
  await expect(root).toHaveAttribute('data-orientation', 'vertical');
  await expect(root).toHaveCSS('flex-direction', 'row');
  await expect(list).toHaveCSS('flex-direction', 'column');
  await expect(root).toHaveAttribute('data-original-node', 'true');
}

test('Steps orientation updates machine and CSS on one node', verifiesReactiveOrientation);

/** Verify responsive attributes, live choices, and consumer-owned presentation. */
async function verifiesCssContract({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=components-steps-styles--css-contract');
  const root = page.getByTestId('steps-css-root');
  const indicator = page.getByTestId('steps-css-indicator');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveAttribute('data-size', 'xs');
  await expect(root).toHaveAttribute('data-size-md', 'lg');
  await expect(root).toHaveAttribute('data-variant-md', 'subtle');
  await expect(indicator).toHaveCSS('width', '24px');
  await page.getByTestId('steps-size-toggle').click();
  await expect(root).toHaveAttribute('data-size', 'sm');
  await expect(indicator).toHaveCSS('width', '32px');
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(indicator).toHaveCSS('width', '44px');
  await expect(indicator).toHaveCSS('border-top-width', '0px');
  await expect(page.getByTestId('steps-css-unstyled-root')).toHaveAttribute('data-unstyled', '');
  await expect(page.getByTestId('steps-css-unstyled-indicator')).toHaveCSS(
    'background-color',
    'rgb(112, 37, 97)',
  );
  await expect(page.getByTestId('steps-css-part')).toHaveAttribute('data-unstyled', '');
  await expect(page.getByTestId('steps-css-part')).toHaveCSS(
    'background-color',
    'rgb(112, 37, 97)',
  );
}

test('Steps uses authored CSS with responsive and consumer-owned choices', verifiesCssContract);
