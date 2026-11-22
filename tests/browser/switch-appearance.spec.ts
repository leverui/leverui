import { expect, test, type Locator, type Page } from '@playwright/test';

const sizes = [
  { name: 'xs', width: '24px' },
  { name: 'sm', width: '32px' },
  { name: 'md', width: '40px' },
  { name: 'lg', width: '48px' },
] as const;

/** Cover all size and variant combinations plus unlayered consumer CSS. */
async function verifiesSwitchAppearance({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch--appearance');
  for (const { name, width } of sizes) {
    for (const variant of ['solid', 'raised'] as const) {
      const root = page.getByTestId(`switch-matrix-${name}-${variant}`);
      await expect(root).toBeVisible({ timeout: 30_000 });
      const control = root.locator('.leverui-switch__control');
      const actual = await control.evaluate(
        /** Read the browser's resolved track width for this recipe combination. */
        (element) => getComputedStyle(element).width,
      );
      expect(actual).toBe(width);
      await expect(root.getByRole('checkbox')).not.toBeChecked();
    }
  }
  const overrideColor = await page.getByTestId('switch-css-override-control').evaluate(
    /** Confirm consumer CSS wins over the generated slot recipe. */
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(overrideColor).toBe('rgb(1, 99, 222)');
  await expect(page.getByTestId('switch-native-style-control')).toHaveCSS(
    'background-color',
    'rgb(8, 88, 152)',
  );
  await expect(page.getByTestId('switch-native-style-control')).toHaveCSS('border-radius', '7px');
  const unstyledRoot = page.getByTestId('switch-unstyled-root');
  await expect(unstyledRoot).toHaveAttribute('data-unstyled', '');
  await expect(unstyledRoot.locator('.leverui-switch__control')).not.toHaveCSS('width', '40px');
  const unstyledControl = page
    .getByTestId('switch-unstyled-control-root')
    .locator('.leverui-switch__control');
  await expect(unstyledControl).toHaveAttribute('data-unstyled', '');
  await expect(unstyledControl).not.toHaveCSS('width', '40px');
}

test('Switch applies every size and variant and accepts consumer CSS', verifiesSwitchAppearance);

/** Verify ordinary breakpoint selections use the authored stylesheet. */
async function verifiesResponsiveSwitchSizes({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch--responsive-sizes');
  const objectRoot = page.getByTestId('switch-responsive-object');
  const arrayRoot = page.getByTestId('switch-responsive-array');
  await expect(objectRoot).toBeVisible({ timeout: 30_000 });
  await expect(objectRoot).not.toHaveAttribute('data-leverui-private-style-runtime', '');
  await expect(arrayRoot).not.toHaveAttribute('data-leverui-private-style-runtime', '');
  const cases = [
    { viewport: 400, object: '24px', array: '48px' },
    { viewport: 500, object: '32px', array: '48px' },
    { viewport: 800, object: '40px', array: '24px' },
    { viewport: 1100, object: '48px', array: '24px' },
    { viewport: 1300, object: '24px', array: '24px' },
    { viewport: 1600, object: '40px', array: '24px' },
  ] as const;
  for (const { viewport, object, array } of cases) {
    await page.setViewportSize({ width: viewport, height: 700 });
    await expect(objectRoot.locator('.leverui-switch__control')).toHaveCSS('width', object);
    await expect(arrayRoot.locator('.leverui-switch__control')).toHaveCSS('width', array);
  }
  await expect(objectRoot.getByRole('checkbox')).not.toBeChecked();
  await objectRoot.locator('.leverui-switch__control').click();
  await expect(objectRoot.getByRole('checkbox')).toBeChecked();
}

test('responsive Switch sizes follow authored CSS breakpoints', verifiesResponsiveSwitchSizes);

/** Read control and thumb presentation for scalar-to-responsive comparison. */
async function readVariantAppearance(root: Locator): Promise<Record<string, string>> {
  return root.evaluate(
    /** Compare browser-computed values rather than copied CSS declarations. */
    (element) => {
      const control = element.querySelector('.leverui-switch__control');
      const thumb = element.querySelector('.leverui-switch__thumb');
      if (!control || !thumb) throw new Error('Switch appearance parts are missing.');
      const track = getComputedStyle(control);
      const handle = getComputedStyle(thumb);
      return {
        controlHeight: track.height,
        controlBackground: track.backgroundColor,
        controlShadow: track.boxShadow,
        thumbBackground: handle.backgroundColor,
        thumbShadow: handle.boxShadow,
        thumbPosition: handle.position,
        thumbTop: handle.top,
        thumbScale: handle.scale,
      };
    },
  );
}

/** Verify variant changes keep track geometry and machine state in sync. */
async function verifiesResponsiveSwitchVariants({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=components-switch--responsive-variants');
  const objectRoot = page.getByTestId('switch-responsive-variant-object');
  const arrayRoot = page.getByTestId('switch-responsive-variant-array');
  const solidReference = page.getByTestId('switch-variant-solid-reference');
  const raisedReference = page.getByTestId('switch-variant-raised-reference');
  await expect(objectRoot).toBeVisible({ timeout: 30_000 });
  await expect(objectRoot).not.toHaveAttribute('data-leverui-private-style-runtime', '');
  await expect(arrayRoot).not.toHaveAttribute('data-leverui-private-style-runtime', '');
  const cases = [
    { viewport: 400, object: '20px', array: '10px' },
    { viewport: 500, object: '10px', array: '10px' },
    { viewport: 800, object: '20px', array: '20px' },
    { viewport: 1100, object: '10px', array: '20px' },
    { viewport: 1300, object: '20px', array: '20px' },
    { viewport: 1600, object: '10px', array: '20px' },
  ] as const;
  for (const { viewport, object, array } of cases) {
    await page.setViewportSize({ width: viewport, height: 700 });
    await expect(objectRoot.locator('.leverui-switch__control')).toHaveCSS('height', object);
    await expect(arrayRoot.locator('.leverui-switch__control')).toHaveCSS('height', array);
    await expect(objectRoot.locator('.leverui-switch__thumb')).toHaveCSS(
      'scale',
      object === '20px' ? '0.8' : '1',
    );
    await expect(arrayRoot.locator('.leverui-switch__thumb')).toHaveCSS(
      'scale',
      array === '20px' ? '0.8' : '1',
    );
    await expect
      .poll(() => readVariantAppearance(objectRoot))
      .toEqual(await readVariantAppearance(object === '20px' ? solidReference : raisedReference));
    await expect
      .poll(() => readVariantAppearance(arrayRoot))
      .toEqual(await readVariantAppearance(array === '20px' ? solidReference : raisedReference));
  }
  await objectRoot.locator('.leverui-switch__control').click();
  await raisedReference.locator('.leverui-switch__control').click();
  await expect(objectRoot.getByRole('checkbox')).toBeChecked();
  await expect(raisedReference.getByRole('checkbox')).toBeChecked();
  await expect
    .poll(
      /** Wait for both checked track transitions before comparing colors. */
      async () => {
        const actual = await readVariantAppearance(objectRoot);
        const expected = await readVariantAppearance(raisedReference);
        return JSON.stringify(actual) === JSON.stringify(expected);
      },
    )
    .toBe(true);
}

test(
  'responsive Switch variants follow authored CSS breakpoints',
  verifiesResponsiveSwitchVariants,
);
