import { expect, test, type Page } from '@playwright/test';

/** Verify the navigation landmark, ordered list, current page, and hidden parts. */
async function verifiesBreadcrumbSemantics({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-breadcrumb--contract');
  const root = page.getByTestId('breadcrumb-root');
  const list = page.getByTestId('breadcrumb-list');
  const current = page.getByTestId('breadcrumb-current');
  const separator = page.getByTestId('breadcrumb-separator');
  const ellipsis = page.getByTestId('breadcrumb-ellipsis');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveJSProperty('tagName', 'NAV');
  await expect(root).toHaveAttribute('aria-label', 'breadcrumb');
  await expect(root).toHaveAttribute('data-size', 'sm');
  await expect(root).toHaveAttribute('data-variant', 'plain');
  await expect(root).not.toHaveAttribute('data-leverui-private-style-runtime');
  await expect(list).toHaveJSProperty('tagName', 'OL');
  await expect(current).toHaveJSProperty('tagName', 'SPAN');
  await expect(current).toHaveAttribute('role', 'link');
  await expect(current).toHaveAttribute('aria-current', 'page');
  await expect(separator).toHaveJSProperty('tagName', 'LI');
  await expect(separator).toHaveAttribute('aria-hidden', 'true');
  await expect(separator.locator('svg path')).toHaveAttribute('d', 'm9 18 6-6-6-6');
  await expect(page.getByTestId('breadcrumb-custom-separator')).toHaveText('/');
  await expect(page.getByTestId('breadcrumb-custom-separator').locator('svg')).toHaveCount(0);
  await expect(ellipsis).toHaveJSProperty('tagName', 'LI');
  await expect(ellipsis).toHaveAttribute('role', 'presentation');
  await expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
  await expect(ellipsis.locator('svg circle')).toHaveCount(3);
  await expect(page.getByTestId('breadcrumb-unstyled-list')).toHaveCSS('display', 'block');
}

test('Breadcrumb preserves semantic parts and default icons', verifiesBreadcrumbSemantics);

/** Verify styled child links keep native keyboard behavior and both refs. */
async function verifiesBreadcrumbLinks({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-breadcrumb--contract');
  const link = page.getByTestId('breadcrumb-router-link');
  await expect(link).toBeVisible({ timeout: 30_000 });
  await expect(link).toHaveJSProperty('tagName', 'A');
  await expect(link).toHaveAttribute('href', '#docs');
  await expect(link).toHaveAttribute('data-parent-ref', 'true');
  await expect(link).toHaveAttribute('data-child-ref', 'true');
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#docs$/);
}

test('Breadcrumb router child retains link interaction and refs', verifiesBreadcrumbLinks);

/** Verify reactive defaults and a variant can coexist without remounting. */
async function verifiesBreadcrumbRecipe({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-breadcrumb--contract');
  const root = page.getByTestId('breadcrumb-root');
  const list = page.getByTestId('breadcrumb-list');
  const variant = page.getByTestId('breadcrumb-variant-link');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(list).toHaveCSS('font-size', '12px');
  await root.evaluate(
    /** Tag the original nav before its inherited recipe changes. */
    (element) => element.setAttribute('data-original', 'true'),
  );
  await page.getByTestId('breadcrumb-size-toggle').click();
  await expect(root).toHaveAttribute('data-original', 'true');
  await expect(root).toHaveAttribute('data-size', 'lg');
  await expect(list).toHaveCSS('font-size', '16px');
  await expect(page.getByTestId('breadcrumb-style-probe')).toHaveCSS('display', 'inline-flex');
  await expect(page.getByTestId('breadcrumb-variant-root')).toHaveAttribute(
    'data-variant',
    'underline',
  );
  await expect(variant).toHaveCSS('text-decoration-line', 'underline');
  await page.addStyleTag({
    content: '.leverui-breadcrumb__link[data-testid="breadcrumb-home-link"]{color:rgb(10, 20, 30)}',
  });
  await expect(page.getByTestId('breadcrumb-home-link')).toHaveCSS('color', 'rgb(10, 20, 30)');
}

test('Breadcrumb recipe defaults react without replacing native parts', verifiesBreadcrumbRecipe);

/** Verify responsive list sizing across the library's medium breakpoint. */
async function verifiesResponsiveBreadcrumb({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=components-breadcrumb--contract');
  const list = page.getByTestId('breadcrumb-responsive-list');
  const variant = page.getByTestId('breadcrumb-responsive-link');
  await expect(list).toHaveCSS('font-size', '12px');
  await expect(list).toHaveCSS('gap', '4px');
  await expect(variant).toHaveCSS('text-decoration-line', 'none');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(list).toHaveCSS('font-size', '16px');
  await expect(list).toHaveCSS('gap', '8px');
  await expect(variant).toHaveCSS('text-decoration-line', 'underline');
}

test('Breadcrumb size responds to viewport changes', verifiesResponsiveBreadcrumb);
