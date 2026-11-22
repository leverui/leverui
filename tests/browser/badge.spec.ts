import { expect, test, type Page } from '@playwright/test';

/** Verify Badge's native contract, composition, and reactive defaults. */
async function verifiesBadgeContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-badge--contract');
  const badge = page.getByTestId('badge-default');
  await expect(badge).toHaveJSProperty('tagName', 'SPAN');
  await expect(badge).toHaveText('Active');
  await expect(badge).toHaveAttribute('title', 'Current status');
  await expect(badge).toHaveAttribute('data-ref-tag', 'span');
  await expect(badge).toHaveClass(/leverui-badge/);
  await expect(badge).not.toHaveAttribute('role');
  await expect(badge).not.toHaveAttribute('size');
  await expect(badge).not.toHaveAttribute('variant');

  const inherited = page.getByTestId('badge-inherited');
  const fixed = page.getByTestId('badge-fixed');
  await expect(inherited).toHaveClass(/provider-badge/);
  await expect(fixed).toHaveClass(/provider-badge/);
  await expect(fixed).toHaveClass(/fixed-badge/);
  await expect(inherited).toHaveCSS('min-height', '16px');
  await expect(fixed).toHaveCSS('min-height', '20px');
  await page.getByTestId('badge-toggle').click();
  await expect(inherited).toHaveCSS('min-height', '28px');
  await expect(fixed).toHaveCSS('min-height', '20px');

  await expect(page.getByTestId('badge-section')).toHaveJSProperty('tagName', 'SECTION');
  await expect(page.getByTestId('badge-section')).toHaveAttribute('data-ref-tag', 'section');
  await expect(page.getByTestId('badge-child')).toHaveJSProperty('tagName', 'STRONG');
  await expect(page.getByTestId('badge-child')).toHaveClass(/leverui-badge/);
  await expect(page.getByTestId('badge-unstyled')).toHaveCSS('display', 'inline');
  await expect(page.getByTestId('badge-custom')).toHaveCSS('border-top-width', '4px');
}

test('Badge preserves native composition and reactive defaults', verifiesBadgeContract);

/** Verify a mounted Badge updates variant and palette without replacing its span. */
async function verifiesReactiveAppearance({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-badge--contract');
  const badge = page.getByTestId('badge-reactive');
  await expect(badge).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(badge).toHaveCSS('color', 'rgb(255, 255, 255)');
  await badge.evaluate(
    /** Mark the existing native node before updating its appearance props. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('badge-appearance-toggle').click();
  await expect(badge).toHaveAttribute('data-original-node', 'true');
  await expect(badge).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(badge).toHaveCSS('color', 'rgb(17, 105, 50)');
  await expect(badge).toHaveCSS('box-shadow', /rgb\(34, 197, 94\).*inset/);
  await expect(badge).not.toHaveAttribute('variant');
  await expect(badge).not.toHaveAttribute('colorPalette');
}

test('Badge updates variant and palette on the same native span', verifiesReactiveAppearance);

/** Verify the authored breakpoint CSS changes Badge size without client style rules. */
async function verifiesResponsiveSize({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=content-badge--contract');
  const badge = page.getByTestId('badge-responsive');
  await expect(badge).toHaveAttribute('data-size', 'xs');
  await expect(badge).toHaveAttribute('data-size-md', 'lg');
  await expect(badge).toHaveCSS('min-height', '16px');
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(badge).toHaveCSS('min-height', '28px');
}

test('Badge size follows authored responsive CSS', verifiesResponsiveSize);
