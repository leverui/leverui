import { expect, test, type Page } from '@playwright/test';

const sizes = [
  ['xs', '12px'],
  ['sm', '14px'],
  ['md', '16px'],
  ['lg', '18px'],
  ['xl', '20px'],
  ['2xl', '24px'],
  ['3xl', '30px'],
  ['4xl', '36px'],
  ['5xl', '48px'],
  ['6xl', '60px'],
  ['7xl', '72px'],
] as const;

/** Verify heading semantics, sizes, polymorphism, and live defaults. */
async function verifiesHeadingContract({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-heading--contract');
  const heading = page.getByTestId('heading-default');
  await expect(heading).toBeVisible({ timeout: 15_000 });
  await expect(heading).toHaveJSProperty('tagName', 'H2');
  await expect(heading).toHaveCSS('font-size', '20px');
  await expect(heading).toHaveCSS('font-weight', '600');
  await expect(heading).toHaveClass(/leverui-heading/);
  await expect(heading).not.toHaveAttribute('size');
  await expect(page.getByRole('heading', { name: 'Default heading', level: 2 })).toBeVisible();

  for (const [size, fontSize] of sizes) {
    await expect(page.getByTestId(`heading-size-${size}`)).toHaveCSS('font-size', fontSize);
    await expect(page.getByTestId(`heading-size-${size}`)).not.toHaveAttribute('size');
  }

  const inherited = page.getByTestId('heading-inherited');
  const fixed = page.getByTestId('heading-fixed');
  await expect(inherited).toHaveCSS('font-size', '14px');
  await expect(inherited).toHaveCSS('color', 'rgb(239, 68, 68)');
  await expect(inherited).toHaveClass(/provider-heading/);
  await expect(fixed).toHaveCSS('font-size', '16px');
  await expect(fixed).toHaveCSS('color', 'rgb(34, 197, 94)');

  const h1 = page.getByTestId('heading-h1');
  await expect(h1).toHaveJSProperty('tagName', 'H1');
  await expect(h1).toHaveAttribute('data-ref-tag', 'h1');
  await expect(h1).toHaveAttribute('title', 'Page title');
  await expect(h1).toHaveCSS('font-size', '14px');
  await expect(h1).toHaveCSS('color', 'rgb(239, 68, 68)');
  await expect(h1).toHaveClass(/provider-heading/);
  await expect(page.getByRole('heading', { name: 'Page title', level: 1 })).toBeVisible();
  const link = page.getByRole('link', { name: 'Heading link' });
  await expect(link).toHaveAttribute('href', '#heading-target');
  await expect(link).toHaveCSS('color', 'rgb(239, 68, 68)');
  await expect(link).toHaveClass(/provider-heading/);
  await link.focus();
  await expect(link).toBeFocused();
  await expect(page.getByTestId('heading-weight')).toHaveCSS('font-weight', '400');
  await expect(page.getByTestId('heading-unstyled')).toHaveClass(/leverui-heading/);
  await expect(page.getByTestId('heading-local-style')).toHaveCSS('font-size', '30px');

  await page.addStyleTag({ content: '.leverui-heading.consumer-heading{font-weight:300}' });
  await expect(page.getByTestId('heading-css-override')).toHaveCSS('font-weight', '300');
  await inherited.evaluate(
    /** Mark the original native heading before changing provider defaults. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('heading-toggle').click();
  await expect(inherited).toHaveAttribute('data-original-node', 'true');
  await expect(inherited).toHaveCSS('font-size', '30px');
  await expect(inherited).toHaveCSS('color', 'rgb(59, 130, 246)');
  await expect(h1).toHaveCSS('color', 'rgb(59, 130, 246)');
  await expect(link).toHaveCSS('color', 'rgb(59, 130, 246)');
  await expect(fixed).toHaveCSS('font-size', '16px');
  await expect(fixed).toHaveCSS('color', 'rgb(34, 197, 94)');
  await expect(page.getByTestId('heading-local-style')).toHaveCSS('font-size', '40px');
}

test('Heading preserves semantic levels and reactive native defaults', verifiesHeadingContract);

/** Verify that consumer theme tokens and native styles reach published Heading. */
async function verifiesCustomHeadingSystem({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-heading--custom-system');
  const heading = page.getByTestId('heading-custom-system');
  await expect(heading).toBeVisible({ timeout: 15_000 });
  await expect(heading).toHaveCSS('font-size', '32px');
  await expect(heading).toHaveCSS('line-height', '40px');
  await expect(heading).toHaveCSS('font-weight', '400');
  await expect(heading).toHaveCSS('font-family', 'Georgia, serif');
  await expect(heading).toHaveClass(/leverui-heading/);
}

test('Heading uses consumer font tokens and native style', verifiesCustomHeadingSystem);
