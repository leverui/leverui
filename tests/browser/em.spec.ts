import { expect, test, type Page } from '@playwright/test';

/** Verify native semantics, override precedence, refs, and live styles. */
async function verifiesEmContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-em--contract');
  const native = page.getByTestId('native-em');
  const reactive = page.getByTestId('reactive-em');
  await expect(native).toBeVisible({ timeout: 15_000 });
  await expect(native).toHaveJSProperty('tagName', 'EM');
  await expect(native).toHaveAttribute('data-ref-tag', 'em');
  await expect(native).toHaveAttribute('title', 'Emphasis');
  await expect(native).toHaveCSS('font-style', 'italic');
  await expect(page.getByTestId('css-override-em')).toHaveCSS('font-style', 'normal');
  await expect(reactive).toHaveCSS('color', 'rgb(239, 68, 68)');
  await reactive.evaluate(
    /** Mark the original reactive node before changing styles. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  const strong = page.getByTestId('strong-em');
  await expect(strong).toHaveJSProperty('tagName', 'STRONG');
  await expect(strong).toHaveAttribute('data-ref-tag', 'strong');
  await expect(strong).toHaveCSS('font-style', 'italic');
  const unstyled = page.getByTestId('unstyled-em');
  await expect(unstyled).toHaveClass(/leverui-em/);
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).toHaveCSS('font-style', 'italic');
  await expect(page.getByTestId('unstyled-span-em')).toHaveCSS('font-style', 'normal');
  const link = page.getByRole('link', { name: 'Emphasized link' });
  await expect(link).toHaveAttribute('href', '#em-target');
  await expect(link).toHaveCSS('font-style', 'italic');
  await link.focus();
  await expect(link).toBeFocused();

  await page.getByTestId('em-toggle').click();
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(reactive).toHaveCSS('font-style', 'normal');
  await expect(reactive).toHaveCSS('color', 'rgb(59, 130, 246)');
  await expect(native).toHaveCSS('font-style', 'italic');
}

test('Em preserves native emphasis and consumer style overrides', verifiesEmContract);
