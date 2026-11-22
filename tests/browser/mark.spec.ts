import { expect, test, type Page } from '@playwright/test';

/** Verify native markup and every documented Mark appearance. */
async function verifiesMarkVariants({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 800 });
  await page.goto('/iframe.html?id=content-mark--contract');
  const base = page.getByTestId('mark-default');
  await expect(base).toBeVisible({ timeout: 45_000 });
  await expect(base).toHaveJSProperty('tagName', 'MARK');
  await expect(base).toHaveClass(/leverui-mark/);
  await expect(base).toHaveCSS('white-space', 'nowrap');
  await expect(base).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  const subtle = page.getByTestId('mark-subtle');
  const solid = page.getByTestId('mark-solid');
  const text = page.getByTestId('mark-text');
  const plain = page.getByTestId('mark-plain');
  await expect(solid).not.toHaveAttribute('data-leverui-private-style-runtime');
  const solidBackground = await solid.evaluate(
    /** Read the blue solid treatment's computed background. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  await expect(subtle).not.toHaveCSS('background-color', solidBackground);
  await expect(solid).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(text).toHaveCSS('font-weight', '500');
  await expect(plain).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(plain).toHaveCSS('font-weight', '400');
  for (const variant of [subtle, solid, text, plain]) {
    await expect(variant).not.toHaveAttribute('variant');
    await expect(variant).not.toHaveAttribute('colorPalette');
  }

  await expect(page.getByTestId('mark-css')).toHaveCSS('background-color', 'rgb(239, 68, 68)');
  const responsive = page.getByTestId('mark-responsive');
  await expect(responsive).toHaveCSS(
    'background-color',
    await subtle.evaluate(
      /** Compare the narrow responsive appearance to the subtle variant. */
      (element) => getComputedStyle(element).backgroundColor,
    ),
  );
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(responsive).toHaveCSS('background-color', solidBackground);
  await page.addStyleTag({
    content: '[data-testid="mark-solid"] { --leverui-colors-color-palette-solid: rgb(18 52 86); }',
  });
  await expect(solid).toHaveCSS('background-color', 'rgb(18, 52, 86)');
}

/** Verify inherited defaults, native polymorphism, CSS overrides, and updates. */
async function verifiesMarkComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-mark--contract');
  const inherited = page.getByTestId('mark-inherited');
  await expect(inherited).toBeVisible({ timeout: 15_000 });
  await expect(inherited).toHaveAttribute('title', 'Shared mark');
  await expect(inherited).toHaveClass(/provider-mark/);
  await expect(inherited).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  const fixed = page.getByTestId('mark-fixed');
  await expect(fixed).toHaveClass(/provider-mark/);
  await expect(fixed).toHaveClass(/instance-mark/);
  await expect(fixed).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  const anchor = page.getByTestId('mark-anchor');
  await expect(anchor).toHaveJSProperty('tagName', 'A');
  await expect(anchor).toHaveAttribute('data-ref-tag', 'a');
  await expect(anchor).toHaveAttribute('href', '#mark-target');
  await expect(anchor).toHaveAttribute('title', 'Shared mark');
  const providerElement = page.getByTestId('mark-provider-as');
  await expect(providerElement).toHaveJSProperty('tagName', 'STRONG');
  await expect(providerElement).toHaveAttribute('title', 'Provider element');
  await expect(providerElement).toHaveClass(/leverui-mark/);
  const localElement = page.getByTestId('mark-provider-as-override');
  await expect(localElement).toHaveJSProperty('tagName', 'MARK');
  await expect(localElement).toHaveAttribute('title', 'Provider element');
  await expect(localElement).toHaveClass(/leverui-mark/);
  await expect(providerElement).not.toHaveAttribute('as');
  await expect(localElement).not.toHaveAttribute('as');
  const childLink = page.getByRole('link', { name: 'Child link label' });
  await expect(childLink).toHaveClass(/leverui-mark/);
  await expect(childLink).toHaveClass(/provider-mark/);
  await childLink.focus();
  await expect(childLink).toBeFocused();
  await expect(page.getByTestId('mark-unstyled')).toHaveCSS('white-space', 'normal');
  await expect(page.getByTestId('mark-style')).toHaveCSS('letter-spacing', '1px');
  await page.addStyleTag({ content: '.leverui-mark.consumer-mark{white-space:normal}' });
  await expect(page.getByTestId('mark-consumer-css')).toHaveCSS('white-space', 'normal');

  await inherited.evaluate(
    /** Tag the original node before the provider variant changes. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('mark-toggle').click();
  await expect(inherited).toHaveAttribute('data-original-node', 'true');
  await expect(inherited).toHaveCSS('font-weight', '500');
  await expect(inherited).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(fixed).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.getByTestId('mark-style')).toHaveCSS('letter-spacing', '2px');
}

test('Mark preserves native semantics and all authored variants', verifiesMarkVariants);
test('Mark composes provider defaults and native elements reactively', verifiesMarkComposition);
