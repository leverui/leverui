import { expect, test, type Page } from '@playwright/test';

/** Verify public CSS variables, native style, and unstyled rendering. */
async function verifiesCodeBlockThemeExtension({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-code-block-theme--contract');
  const custom = page.getByTestId('theme-custom-root');
  await expect(custom).toHaveCSS('border-radius', '19px');
  await expect(custom).toHaveCSS('border-top-width', '4px');
  await expect(page.getByTestId('theme-custom-title')).toHaveCSS('line-height', '16px');
  await expect(page.getByTestId('theme-custom-code')).toHaveCSS('overflow-x', 'auto');

  const unstyled = page.getByTestId('theme-unstyled-root');
  await expect(unstyled).toHaveClass(/lui-code-block__root/);
  await expect(unstyled).toHaveAttribute('data-unstyled', '');
  await expect(unstyled).toHaveCSS('border-top-width', '0px');
  await expect(unstyled).toHaveCSS('border-radius', '0px');
  await expect(unstyled.locator('[aria-expanded]')).toHaveCSS('max-height', 'none');
  await expect(unstyled.locator('pre')).toHaveCSS('overflow-x', 'visible');
  await expect(unstyled.locator('code')).toHaveCSS('padding-left', '0px');
  await expect(page.getByTestId('theme-unstyled-code')).toHaveJSProperty('tagName', 'PRE');
  await expect(unstyled.locator('code')).toHaveText('Unstyled source');

  await page.addStyleTag({ content: ':root { --lui-code-block-radius: 27px; }' });
  await expect(page.getByTestId('theme-css-root')).toHaveCSS('border-radius', '27px');
  await page.addStyleTag({
    content: '[data-testid="theme-css-root"] { --lui-code-block-radius: 23px; }',
  });
  await expect(page.getByTestId('theme-css-root')).toHaveCSS('border-radius', '23px');
  await expect(page.getByTestId('theme-instance-css-root')).toHaveCSS('border-top-width', '5px');
  await expect(page.getByTestId('theme-instance-css-code')).toContainText('Native style');
}

/** Verify a reactive size selector remains scoped to its nearest root. */
async function verifiesCodeBlockStyleScope({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=internal-code-block-theme--contract');
  const outer = page.getByTestId('theme-outer-root');
  const inner = page.getByTestId('theme-inner-root');
  await expect(outer).toHaveAttribute('data-size', 'sm');
  await expect(outer).toHaveCSS('border-radius', '6px');
  await expect(inner).toHaveCSS('border-radius', '8px');
  await outer.evaluate(
    /** Mark the native root before its size selector updates. */
    (element) => element.setAttribute('data-original-root', 'true'),
  );

  await page.getByTestId('theme-size-toggle').click();
  await expect(outer).toHaveAttribute('data-size', 'lg');
  await expect(outer).toHaveCSS('border-radius', '12px');
  await expect(outer).toHaveAttribute('data-original-root', 'true');
  await expect(inner).toHaveCSS('border-radius', '8px');
}

test(
  'Code Block supports CSS variable and native style customization',
  verifiesCodeBlockThemeExtension,
);
test('Code Block sizes follow the nearest reactive root', verifiesCodeBlockStyleScope);
