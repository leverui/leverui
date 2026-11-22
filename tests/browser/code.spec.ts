import { expect, test, type Page } from '@playwright/test';

/** Verify Code's native semantics and every size and appearance. */
async function verifiesCodeMatrix({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-code--matrix');
  const code = page.getByTestId('code-default');
  await expect(code).toHaveJSProperty('tagName', 'CODE', { timeout: 45_000 });
  await expect(code).toHaveText('npm run build');
  await expect(code).toHaveAttribute('title', 'Build command');
  await expect(code).toHaveAttribute('data-ref-tag', 'code');
  await expect(code).toHaveClass(/(?:^|\s)leverui-code(?:\s|$)/);
  await expect(code).toHaveCSS('display', 'inline-flex');
  await expect(code).toHaveCSS('font-family', /monospace/);
  await expect(code).toHaveCSS('border-radius', '4px');
  await expect(code).toHaveCSS('min-height', '20px');
  await expect(code).toHaveCSS('background-color', 'rgb(244, 244, 245)');
  await expect(code).toHaveCSS('color', 'rgb(39, 39, 42)');
  await expect(code).not.toHaveAttribute('role');
  await expect(code).not.toHaveAttribute('size');
  await expect(code).not.toHaveAttribute('variant');

  await expect(page.getByTestId('code-xs')).toHaveCSS('min-height', '16px');
  await expect(page.getByTestId('code-xs')).toHaveCSS('font-size', '10px');
  await expect(page.getByTestId('code-xs')).toHaveCSS('padding-left', '4px');
  await expect(page.getByTestId('code-sm')).toHaveCSS('min-height', '20px');
  await expect(page.getByTestId('code-sm')).toHaveCSS('font-size', '12px');
  await expect(page.getByTestId('code-sm')).toHaveCSS('padding-left', '6px');
  await expect(page.getByTestId('code-md')).toHaveCSS('min-height', '24px');
  await expect(page.getByTestId('code-md')).toHaveCSS('font-size', '14px');
  await expect(page.getByTestId('code-md')).toHaveCSS('padding-left', '8px');
  await expect(page.getByTestId('code-lg')).toHaveCSS('min-height', '28px');
  await expect(page.getByTestId('code-lg')).toHaveCSS('font-size', '14px');
  await expect(page.getByTestId('code-lg')).toHaveCSS('padding-left', '10px');
  await expect(page.getByTestId('code-solid')).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(page.getByTestId('code-solid')).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(page.getByTestId('code-subtle')).toHaveCSS('background-color', 'rgb(219, 234, 254)');
  await expect(page.getByTestId('code-subtle')).toHaveCSS('color', 'rgb(23, 61, 166)');
  await expect(page.getByTestId('code-outline')).toHaveCSS(
    'box-shadow',
    'rgb(59, 130, 246) 0px 0px 0px 1px inset',
  );
  await expect(page.getByTestId('code-surface')).toHaveCSS(
    'background-color',
    'rgb(219, 234, 254)',
  );
  await expect(page.getByTestId('code-surface')).toHaveCSS(
    'box-shadow',
    'rgb(191, 219, 254) 0px 0px 0px 1px inset',
  );
  await expect(page.getByTestId('code-plain')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.getByTestId('code-plain')).toHaveCSS('color', 'rgb(23, 61, 166)');
  await expect(page.getByTestId('code-green')).toHaveCSS('background-color', 'rgb(22, 163, 74)');
  await expect(page.getByTestId('code-span')).toHaveJSProperty('tagName', 'SPAN');
  await expect(page.getByTestId('code-child')).toHaveJSProperty('tagName', 'STRONG');
  await expect(page.getByTestId('code-unstyled')).toHaveCSS('display', 'inline');
  await expect(page.getByTestId('code-border')).toHaveCSS('border-top-width', '4px');
}

test('Code preserves native markup and the full guide matrix', verifiesCodeMatrix);

/** Verify mounted appearance changes and responsive size without replacing nodes. */
async function verifiesReactiveCode({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=typography-code--matrix');
  const inherited = page.getByTestId('code-inherited');
  const fixed = page.getByTestId('code-fixed');
  const responsive = page.getByTestId('code-responsive');
  await expect(inherited).toHaveClass(/provider-code/);
  await expect(fixed).toHaveClass(/provider-code/);
  await expect(fixed).toHaveClass(/fixed-code/);
  await expect(inherited).toHaveCSS('min-height', '16px');
  await expect(fixed).toHaveCSS('min-height', '20px');
  await expect(responsive).toHaveCSS('min-height', '16px');
  await inherited.evaluate(
    /** Mark the original Code element before changing provider defaults. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('code-size-toggle').click();
  await expect(inherited).toHaveAttribute('data-original-node', 'true');
  await expect(inherited).toHaveCSS('min-height', '28px');
  await expect(fixed).toHaveCSS('min-height', '20px');

  const reactive = page.getByTestId('code-reactive');
  await expect(reactive).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await reactive.evaluate(
    /** Mark the existing Code element before changing its appearance. */
    (element) => element.setAttribute('data-appearance-node', 'true'),
  );
  await page.getByTestId('code-appearance-toggle').click();
  await expect(reactive).toHaveAttribute('data-appearance-node', 'true');
  await expect(reactive).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(reactive).toHaveCSS('box-shadow', /inset/);
  await expect(reactive).not.toHaveAttribute('variant');
  await expect(reactive).not.toHaveAttribute('colorPalette');

  await page.setViewportSize({ width: 900, height: 720 });
  await expect(responsive).toHaveCSS('min-height', '28px');
}

test('Code updates mounted appearance and follows responsive size', verifiesReactiveCode);

/** Verify CSS-first overrides and the closest light or dark theme scope. */
async function verifiesCodeThemeScopes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-code--matrix');
  await expect(page.locator('#code-css-override')).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  const lightBackground = await page.getByTestId('code-default').evaluate(
    /** Read the ordinary light Code background for scope comparison. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await expect(page.getByTestId('code-dark')).not.toHaveCSS('background-color', lightBackground);
  await expect(page.getByTestId('code-dark')).toHaveCSS('background-color', 'rgb(24, 24, 27)');
  await expect(page.getByTestId('code-dark')).toHaveCSS('color', 'rgb(228, 228, 231)');
  await expect(page.getByTestId('code-nested-light')).toHaveCSS(
    'background-color',
    lightBackground,
  );
  await expect(page.getByTestId('code-nested-light')).toHaveCSS('color', 'rgb(39, 39, 42)');
}

test('Code respects consumer CSS and nearest theme scope', verifiesCodeThemeScopes);

/** Verify consumer CSS wins over defaults and child composition forwards props. */
async function verifiesCodeCompositionStyles({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=typography-code--matrix');
  const styled = page.getByTestId('code-css-class');
  await expect(styled).toHaveCSS('background-color', 'rgb(91, 42, 120)');
  await expect(styled).toHaveCSS('color', 'rgb(255, 255, 0)');
  await expect(styled).toHaveClass(/(?:^|\s)consumer-code(?:\s|$)/);
  await expect(styled).toHaveClass(/(?:^|\s)consumer-code-name(?:\s|$)/);

  const child = page.getByTestId('code-child');
  await expect(child).toHaveJSProperty('tagName', 'STRONG');
  await expect(child).toHaveAttribute('title', 'Child code');
  await expect(child).toHaveClass(/(?:^|\s)consumer-child-code(?:\s|$)/);
  await expect(child).toHaveCSS('color', 'rgb(20, 30, 40)');
}

test('Code applies consumer CSS and forwards styled child props', verifiesCodeCompositionStyles);
