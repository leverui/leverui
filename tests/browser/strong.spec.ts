import { expect, test, type Page } from '@playwright/test';

/** Verify native importance, style precedence, and selected elements. */
async function verifiesStrongContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-strong--contract');
  const native = page.getByTestId('strong-native');
  await expect(native).toBeVisible({ timeout: 15_000 });
  await expect(native).toHaveJSProperty('tagName', 'STRONG');
  await expect(native).toHaveCSS('display', 'inline');
  await expect(native).toHaveCSS('font-weight', '600');
  await expect(native).toHaveAttribute('title', 'Important text');
  await expect(native).toHaveAttribute('data-ref-tag', 'strong');
  await expect(native).not.toHaveAttribute('role');
  await expect(page.getByTestId('strong-inline-row')).toContainText('Before important after');
  await expect(page.getByTestId('strong-css-override')).toHaveCSS('font-weight', '400');
  const hookTarget = page.getByTestId('strong-class-override');
  await expect(hookTarget).toHaveClass(/leverui-strong/);
  await page.addStyleTag({ content: '.strong-hook-scope .leverui-strong{font-weight:300}' });
  await expect(hookTarget).toHaveCSS('font-weight', '300');

  const selected = page.getByTestId('strong-selected');
  await expect(selected).toHaveJSProperty('tagName', 'A');
  await expect(selected).toHaveAttribute('href', '#strong-target');
  await expect(selected).toHaveAttribute('data-ref-tag', 'a');
  await expect(selected).toHaveCSS('font-weight', '600');
  await expect(page.getByTestId('strong-child')).toHaveAttribute('href', '#strong-child-target');
  await expect(page.getByTestId('strong-child')).toHaveCSS('font-weight', '600');
  await expect(page.getByTestId('strong-unstyled')).toHaveClass(/leverui-strong/);
  await expect(page.getByTestId('strong-unstyled')).toHaveCSS('font-weight', '700');
}

test('Strong preserves semantic markup and consumer override precedence', verifiesStrongContract);

/** Verify reactive styles update the mounted native element. */
async function verifiesReactiveStrong({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-strong--contract');
  const reactive = page.getByTestId('strong-reactive');
  await expect(reactive).toHaveCSS('font-weight', '600');
  await expect(reactive).toHaveCSS('color', 'rgb(239, 68, 68)');
  await reactive.evaluate(
    /** Mark the original element before changing its consumer class. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('strong-toggle').click();
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(reactive).toHaveCSS('font-weight', '400');
  await expect(reactive).toHaveCSS('color', 'rgb(59, 130, 246)');
}

test('Strong updates consumer styles without replacing its element', verifiesReactiveStrong);
