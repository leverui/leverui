import { expect, test, type Page } from '@playwright/test';

/** Verify authored CSS, consumer hooks, responsive choices, and live primitive state. */
async function verifiesPinInputCss({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 400, height: 800 });
  await page.goto('/iframe.html?id=internal-pin-input-css--contract');
  const root = page.getByTestId('pin-css-root');
  const control = page.getByTestId('pin-css-control');
  const first = page.getByTestId('pin-css-input-0');
  const second = page.getByTestId('pin-css-input-1');
  const label = page.getByTestId('pin-css-label');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(first).toHaveClass(/leverui-input/);
  await expect(first).toHaveClass(/leverui-pin-input__input/);
  await expect(root).toHaveAttribute('data-size-md', 'lg');
  await expect(root).toHaveAttribute('data-variant-md', 'subtle');
  await expect(root).toHaveAttribute('data-attached-md', 'false');
  await expect(control).toHaveCSS('gap', '0px');
  await expect(first).toHaveCSS('height', '32px');
  await expect(first).toHaveCSS('border-top-color', 'rgb(21, 87, 156)');
  await expect(second).toHaveCSS('background-color', 'rgb(244, 235, 250)');
  await expect(label).toHaveCSS('color', 'rgb(73, 41, 133)');
  await expect(control).toHaveCSS('padding', '3px');

  await page.setViewportSize({ width: 800, height: 800 });
  await expect(control).not.toHaveCSS('gap', '0px');
  await expect(first).toHaveCSS('height', '44px');
  await page.setViewportSize({ width: 1100, height: 800 });
  await expect(control).toHaveCSS('gap', '0px');

  await first.evaluate(
    /** Mark the native field to detect accidental replacement. */
    (element) => {
      (element as HTMLElement).dataset.original = 'true';
    },
  );
  await page.getByTestId('pin-css-toggle').click();
  await expect(first).toHaveAttribute('data-original', 'true');
  await expect(root).toHaveAttribute('data-attached', 'false');
  await expect(control).not.toHaveCSS('gap', '0px');
  await expect(first).toHaveAttribute('aria-invalid', 'true');
  await first.fill('1');
  await expect(second).toBeFocused();

  const unstyled = page.getByTestId('pin-css-unstyled');
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).toHaveCSS('background-color', 'rgb(112, 37, 97)');
  await expect(page.getByTestId('pin-css-unstyled-root')).toHaveAttribute('data-unstyled', '');
}

test('Pin Input uses authored CSS while the primitive remains reactive', verifiesPinInputCss);

/** Verify size, variant, and attached choices at every authored breakpoint. */
async function verifiesPinInputBreakpoints({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-pin-input-css--contract');
  const root = page.getByTestId('pin-css-breakpoints');
  const control = page.getByTestId('pin-css-breakpoints-control');
  const input = page.getByTestId('pin-css-breakpoints-input');
  const cases = [
    [400, '32px', '0px'],
    [600, '36px', '8px'],
    [800, '40px', '0px'],
    [1100, '44px', '8px'],
    [1300, '48px', '0px'],
    [1600, '64px', '8px'],
  ] as const;
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(input).toHaveAttribute('data-variant-2xl', 'flushed');
  for (const [width, height, gap] of cases) {
    await page.setViewportSize({ width, height: 800 });
    await expect(input).toHaveCSS('height', height);
    await expect(control).toHaveCSS('gap', gap);
  }
}

test('Pin Input follows every authored CSS breakpoint', verifiesPinInputBreakpoints);
