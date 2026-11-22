import { expect, test, type Page } from '@playwright/test';

/** Verify native semantics, sizes, and all authored appearances in Chromium. */
async function verifiesKbdMatrix({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=content-kbd--contract');
  const keyboard = page.getByTestId('kbd-default');
  await expect(keyboard).toHaveJSProperty('tagName', 'KBD');
  await expect(keyboard).toHaveText('F12');
  await expect(keyboard).toHaveClass(/leverui-kbd/);
  await expect(keyboard).toHaveCSS('display', 'inline-flex');
  await expect(keyboard).not.toHaveAttribute('role');
  await expect(keyboard).not.toHaveAttribute('size');
  await expect(keyboard).not.toHaveAttribute('variant');
  await expect(page.getByTestId('kbd-combination').locator('kbd')).toHaveCount(3);

  for (const [size, height] of [
    ['sm', '18px'],
    ['md', '20px'],
    ['lg', '24px'],
  ] as const) {
    await expect(page.getByTestId(`kbd-${size}`)).toHaveCSS('height', height);
  }
  await expect(page.getByTestId('kbd-raised')).toHaveCSS('border-bottom-width', '2px');
  await expect(page.getByTestId('kbd-outline')).toHaveCSS('border-top-width', '1px');
  await expect(page.getByTestId('kbd-subtle')).not.toHaveCSS(
    'background-color',
    'rgba(0, 0, 0, 0)',
  );
  await expect(page.getByTestId('kbd-plain')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  for (const variant of ['raised', 'outline', 'subtle', 'plain']) {
    await expect(page.getByTestId(`kbd-${variant}`)).not.toHaveAttribute('variant');
  }
  await expect(page.getByTestId('kbd-responsive')).toHaveCSS('height', '18px');
  await expect(page.getByTestId('kbd-responsive-variant')).toHaveCSS('border-bottom-width', '2px');
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(page.getByTestId('kbd-responsive')).toHaveCSS('height', '24px');
  await expect(page.getByTestId('kbd-responsive-variant')).toHaveCSS('border-bottom-width', '0px');
}

/** Verify provider reactivity, element choice, and local style overrides. */
async function verifiesKbdComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-kbd--contract');
  const inherited = page.getByTestId('kbd-inherited');
  await expect(inherited).toHaveAttribute('title', 'Shared shortcut');
  await expect(inherited).toHaveClass(/provider-kbd/);
  await expect(page.getByTestId('kbd-fixed')).toHaveClass(/provider-kbd/);
  await expect(page.getByTestId('kbd-fixed')).toHaveClass(/fixed-kbd/);
  await expect(inherited).toHaveCSS('height', '18px');
  await inherited.evaluate(
    /** Mark the original node before a provider update. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('kbd-toggle').click();
  await expect(inherited).toHaveAttribute('data-original-node', 'true');
  await expect(inherited).toHaveCSS('height', '24px');
  await expect(page.getByTestId('kbd-fixed')).toHaveCSS('height', '20px');
  await expect(page.getByTestId('kbd-selected')).toHaveJSProperty('tagName', 'SPAN');
  await expect(page.getByTestId('kbd-selected')).toHaveAttribute('data-ref-tag', 'span');
  await expect(page.getByTestId('kbd-child')).toHaveAttribute('aria-label', 'Command key');
  await expect(page.getByTestId('kbd-child')).toHaveClass(/leverui-kbd/);
  await expect(page.getByTestId('kbd-unstyled')).toHaveCSS('display', 'inline');
  await expect(page.getByTestId('kbd-custom-spacing')).toHaveCSS('letter-spacing', '2px');
  await expect(page.getByTestId('kbd-css')).toHaveCSS('color', 'rgb(20, 30, 40)');
}

test('Kbd preserves semantic markup and authored variants', verifiesKbdMatrix);
test('Kbd composes reactive defaults and native elements', verifiesKbdComposition);

/** Verify consumer CSS and palette colors follow the nearest theme scope. */
async function verifiesKbdCssScopes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-kbd--contract');
  const blue = await page.getByTestId('kbd-raised').evaluate(
    /** Read a representative blue authored background. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await expect(page.getByTestId('kbd-green')).not.toHaveCSS('background-color', blue);
  const light = await page.getByTestId('kbd-light').evaluate(
    /** Read the light-scope palette color. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await expect(page.getByTestId('kbd-dark')).not.toHaveCSS('background-color', light);
  await expect(page.getByTestId('kbd-nested-light')).toHaveCSS('background-color', light);

  await page.addStyleTag({
    content:
      '.leverui-kbd[data-testid="kbd-default"]{white-space:normal;background-color:rgb(1, 2, 3)}',
  });
  await expect(page.getByTestId('kbd-default')).toHaveCSS('white-space', 'normal');
  await expect(page.getByTestId('kbd-default')).toHaveCSS('background-color', 'rgb(1, 2, 3)');
}

test('Kbd respects consumer CSS and nested theme colors', verifiesKbdCssScopes);
