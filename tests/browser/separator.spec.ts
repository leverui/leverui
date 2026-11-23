import { expect, test, type Locator, type Page } from '@playwright/test';

/** Allow engines to report a half-pixel border with or without pixel rounding. */
async function expectHairlineWidth(separator: Locator): Promise<void> {
  const width = await separator.evaluate(
    /** Read the computed top border after the 0.5px recipe token resolves. */
    (element) => Number.parseFloat(getComputedStyle(element).borderTopWidth),
  );
  expect(width).toBeGreaterThanOrEqual(0.5);
  expect(width).toBeLessThanOrEqual(1);
}

/** Verify native semantics and each appearance axis. */
async function verifiesSeparatorRecipe({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=content-separator--contract');
  const divider = page.getByTestId('separator-default');
  await expect(divider).toBeVisible({ timeout: 15_000 });
  await expect(divider).toHaveJSProperty('tagName', 'SPAN');
  await expect(divider).toHaveAttribute('role', 'separator');
  await expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
  await expect(divider).toHaveAttribute('title', 'Section divider');
  await expect(divider).toHaveAttribute('data-ref-tag', 'span');
  await expect(divider).toHaveCSS('border-top-width', '1px');
  await expect(divider).toHaveCSS('border-top-style', 'solid');
  await expect(page.getByTestId('separator-dashed')).toHaveCSS('border-top-style', 'dashed');
  await expect(page.getByTestId('separator-dotted')).toHaveCSS('border-top-style', 'dotted');
  for (const [size, width] of [
    ['md', '2px'],
    ['lg', '3px'],
  ] as const) {
    await expect(page.getByTestId(`separator-${size}`)).toHaveCSS('border-top-width', width);
  }
  const hairline = page.getByTestId('separator-xs');
  await expect(hairline).toHaveCSS('--lui-private-separator-thickness', '0.5px');
  await expectHairlineWidth(hairline);
  const vertical = page.getByTestId('separator-vertical');
  await expect(vertical).toHaveAttribute('aria-orientation', 'vertical');
  await expect(vertical).toHaveCSS('border-inline-start-width', '1px');
  const responsive = page.getByTestId('separator-responsive');
  await expect(responsive).toHaveAttribute('role', 'presentation');
  await expect(responsive).not.toHaveAttribute('aria-orientation');
  await expect(responsive).toHaveCSS('border-inline-start-width', '1px');
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(responsive).toHaveCSS('border-top-width', '1px');
  await expect(responsive).toHaveCSS('border-inline-start-width', '1px');
  await expect(responsive).toHaveAttribute('role', 'presentation');
  for (const name of ['variant', 'size', 'orientation', 'unstyled']) {
    await expect(divider).not.toHaveAttribute(name);
  }
}

test('Separator matches native semantics and appearance variants', verifiesSeparatorRecipe);

/** Resolve thickness and treatment changes through authored media queries. */
async function verifiesResponsiveAxes({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=content-separator--contract');
  const separator = page.getByTestId('separator-responsive-axes');
  await expect(separator).toHaveAttribute('data-size', 'xs');
  await expect(separator).toHaveAttribute('data-size-md', 'lg');
  await expect(separator).toHaveCSS('border-top-style', 'dashed');
  await expectHairlineWidth(separator);
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(separator).toHaveCSS('border-top-width', '3px');
  await expect(separator).toHaveCSS('border-top-style', 'dotted');
}

test('Separator resolves responsive CSS axes without style tags', verifiesResponsiveAxes);

/** Verify reactive props, provider defaults, and consumer composition. */
async function verifiesSeparatorComposition({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-separator--contract');
  const inherited = page.getByTestId('separator-inherited');
  await expect(inherited).toHaveCSS('--lui-private-separator-thickness', '0.5px');
  await expectHairlineWidth(inherited);
  await inherited.evaluate(
    /** Mark the provider-owned node before changing its default size. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('separator-size-toggle').click();
  await expect(inherited).toHaveAttribute('data-original-node', 'true');
  await expect(inherited).toHaveCSS('border-top-width', '3px');
  await expect(page.getByTestId('separator-fixed')).toHaveCSS('border-top-width', '2px');

  const reactive = page.getByTestId('separator-reactive');
  await expect(reactive).toHaveAttribute('aria-orientation', 'horizontal');
  await page.getByTestId('separator-orientation-toggle').click();
  await expect(reactive).toHaveAttribute('aria-orientation', 'vertical');
  await expect(reactive).toHaveCSS('border-inline-start-width', '1px');
  await expect(page.getByTestId('separator-selected')).toHaveJSProperty('tagName', 'DIV');
  await expect(page.getByTestId('separator-selected')).toHaveAttribute('data-ref-tag', 'div');
  await expect(page.getByTestId('separator-child')).toHaveCSS('border-top-width', '1px');
  await expect(page.getByTestId('separator-unstyled')).toHaveCSS('border-top-width', '0px');
  await page.addStyleTag({
    content: '.consumer-unstyled { border-top: 2px solid rgb(3, 4, 5); }',
  });
  await expect(page.getByTestId('separator-unstyled')).toHaveCSS('border-top-width', '2px');

  await page.addStyleTag({
    content: '.consumer-separator{border-top-color:rgb(1, 2, 3);--lui-separator-thickness:4px}',
  });
  await expect(page.getByTestId('separator-consumer-css')).toHaveCSS(
    'border-top-color',
    'rgb(1, 2, 3)',
  );
  await expect(page.getByTestId('separator-consumer-css')).toHaveCSS('border-top-width', '4px');
  await expect(page.getByTestId('separator-local-css')).toHaveCSS(
    'border-top-color',
    'rgb(239, 68, 68)',
  );
}

test('Separator composes live defaults and consumer styles', verifiesSeparatorComposition);

/** Verify the start, end, and centered label compositions. */
async function verifiesLabeledSeparators({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-separator--contract');
  for (const position of ['start', 'end', 'center']) {
    const row = page.getByTestId(`separator-label-${position}`);
    const lines = row.getByRole('separator');
    await expect(row.getByText(`Label (${position})`)).toBeVisible();
    await expect(lines).toHaveCount(position === 'center' ? 2 : 1);
    for (const line of await lines.all()) {
      await expect(line).toHaveAttribute('aria-orientation', 'horizontal');
      await expect(line).toHaveCSS('flex-grow', '1');
      await expect(line).toHaveCSS('border-top-width', '1px');
    }
  }
}

test('Separator stretches around visible labels', verifiesLabeledSeparators);
