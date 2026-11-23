import { expect, test, type Page } from '@playwright/test';

/** Verify semantic tags, slot styles, and default trend indicators. */
async function verifiesStatParts({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-stat--contract');
  const root = page.getByTestId('stat-default');
  await expect(root).toBeVisible({ timeout: 15_000 });
  await expect(root).toHaveJSProperty('tagName', 'DL');
  await expect(root).toHaveAttribute('data-size', 'md');
  await expect(root).not.toHaveAttribute('data-lui-private-style-runtime');
  await expect(root).toHaveAttribute('data-ref-tag', 'dl');
  await expect(page.getByTestId('stat-label')).toHaveJSProperty('tagName', 'DT');
  await expect(page.getByTestId('stat-value')).toHaveJSProperty('tagName', 'DD');
  await expect(page.getByTestId('stat-help')).toHaveJSProperty('tagName', 'SPAN');
  await expect(page.getByTestId('stat-unit')).toHaveText('hr');
  await expect(page.getByTestId('stat-up')).toHaveAttribute('data-type', 'up');
  await expect(page.getByTestId('stat-down')).toHaveAttribute('data-type', 'down');
  await expect(page.getByTestId('stat-up').locator('svg path')).toHaveCount(2);
  await expect(page.getByTestId('stat-down').locator('svg path')).toHaveCount(2);
  await expect(root).toHaveCSS('display', 'flex');
  await expect(page.getByTestId('stat-value')).toHaveCSS('font-weight', '600');
  for (const name of ['size', 'recipe', 'unstyled', 'css']) {
    await expect(root).not.toHaveAttribute(name);
  }
}

test('Stat preserves semantic parts and trend indicators', verifiesStatParts);

/** Verify size inheritance, instance overrides, and live provider updates. */
async function verifiesStatVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-stat--contract');
  const group = page.getByTestId('stat-group');
  await expect(group).toHaveAttribute('role', 'group');
  await expect(group).toHaveCSS('display', 'flex');
  await expect(group).not.toHaveAttribute('size');
  const groupValue = page.getByTestId('stat-group-value');
  const fixedValue = page.getByTestId('stat-group-fixed');
  const largeValue = page.getByTestId('stat-large-value');
  const smallValue = page.getByTestId('stat-small-value');
  await expect(groupValue).toHaveCSS(
    'font-size',
    await largeValue.evaluate(
      /** Read the large recipe's computed font size for comparison. */
      (element) => getComputedStyle(element).fontSize,
    ),
  );
  await expect(fixedValue).toHaveCSS(
    'font-size',
    await smallValue.evaluate(
      /** Read the explicitly small recipe's computed font size. */
      (element) => getComputedStyle(element).fontSize,
    ),
  );

  const reactive = page.getByTestId('stat-reactive-value');
  await expect(reactive).toHaveCSS(
    'font-size',
    await smallValue.evaluate(
      /** Record the initial provider size from the small variant. */
      (element) => getComputedStyle(element).fontSize,
    ),
  );
  await reactive.evaluate(
    /** Mark the original value node before changing provider defaults. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('stat-size-toggle').click();
  await expect(page.getByTestId('stat-inherited')).toHaveAttribute('data-size', 'lg');
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(reactive).toHaveCSS(
    'font-size',
    await largeValue.evaluate(
      /** Read the large size after the provider update. */
      (element) => getComputedStyle(element).fontSize,
    ),
  );
}

test('Stat group and provider propagate reactive size variants', verifiesStatVariants);

/** Verify public CSS hooks and reactive custom parts under distinct Stat roots. */
async function verifiesStatCustomStyles({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-stat--contract');
  await page.addStyleTag({
    content: '.lui-stat__root { gap: 19px; } .lui-stat__label { color: rgb(102, 51, 153); }',
  });
  await expect(page.getByTestId('stat-default')).toHaveCSS('gap', '19px');
  await expect(page.getByTestId('stat-label')).toHaveCSS('color', 'rgb(102, 51, 153)');

  const reactive = page.getByTestId('stat-reactive-probe');
  const fixed = page.getByTestId('stat-fixed-probe');
  const small = page.getByTestId('stat-small-value');
  const large = page.getByTestId('stat-large-value');
  const smallSize = await small.evaluate(
    /** Capture the small Stat value font size. */
    (element) => getComputedStyle(element).fontSize,
  );
  const largeSize = await large.evaluate(
    /** Capture the large Stat value font size. */
    (element) => getComputedStyle(element).fontSize,
  );
  await expect(reactive).toHaveCSS('font-size', smallSize);
  await expect(fixed).toHaveCSS('font-size', smallSize);
  await reactive.evaluate(
    /** Mark the custom part before its inherited size changes. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('stat-size-toggle').click();
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(reactive).toHaveCSS('font-size', largeSize);
  await expect(fixed).toHaveCSS('font-size', smallSize);
}

test('Stat CSS hooks support consumer customization', verifiesStatCustomStyles);

/** Verify responsive size changes without replacing the native value node. */
async function verifiesResponsiveStat({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=content-stat--contract');
  const value = page.getByTestId('stat-responsive-value');
  await expect(page.getByTestId('stat-responsive')).toHaveAttribute('data-size', 'sm');
  await expect(page.getByTestId('stat-responsive')).toHaveAttribute('data-size-md', 'lg');
  const smallSize = await page.getByTestId('stat-small-value').evaluate(
    /** Read the static small size for comparison. */
    (element) => getComputedStyle(element).fontSize,
  );
  const largeSize = await page.getByTestId('stat-large-value').evaluate(
    /** Read the static large size for comparison. */
    (element) => getComputedStyle(element).fontSize,
  );
  await expect(value).toHaveCSS('font-size', smallSize);
  await value.evaluate(
    /** Mark the original value before changing viewport width. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(value).toHaveAttribute('data-original-node', 'true');
  await expect(value).toHaveCSS('font-size', largeSize);
}

test('Stat applies responsive sizes to existing semantic parts', verifiesResponsiveStat);
