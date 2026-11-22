import { expect, test, type Page } from '@playwright/test';

/** Verify sizes, shapes, color values, and native marker attributes. */
async function verifiesColorSwatchMatrix({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-color-swatch--matrix');
  const swatch = page.getByTestId('swatch-default');
  await expect(swatch).toHaveJSProperty('tagName', 'SPAN');
  await expect(swatch).toHaveAttribute('data-value', 'red');
  await expect(swatch).toHaveAttribute('title', 'Red sample');
  await expect(swatch).toHaveClass(/leverui-color-swatch/);
  await expect(swatch).toHaveCSS('width', '20px');
  await expect(swatch).toHaveCSS('height', '20px');
  await expect(swatch).not.toHaveAttribute('size');
  await expect(swatch).not.toHaveAttribute('shape');
  await expect(swatch).not.toHaveAttribute('role');

  const pixels = [14, 16, 18, 20, 24, 28, 32, 48, 48];
  const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inherit', 'full'];
  for (const [index, size] of sizes.entries()) {
    await expect(page.getByTestId(`swatch-${size}`)).toHaveCSS('width', `${pixels[index]}px`);
  }
  await expect(page.getByTestId('shape-square')).toHaveCSS('border-radius', '0px');
  await expect(page.getByTestId('shape-circle')).toHaveCSS('border-radius', '9999px');
  await expect(page.getByTestId('shape-rounded')).toHaveCSS('border-radius', '2px');
  await expect(page.getByTestId('swatch-alpha')).toHaveAttribute(
    'data-value',
    'rgba(255, 0, 0, 0.5)',
  );
  await expect(page.getByTestId('swatch-transparent')).toHaveCSS(
    'background-image',
    /repeating-conic-gradient/,
  );
}

test('Color Swatch renders the size and shape matrix', verifiesColorSwatchMatrix);

/** Verify every mixed layout stays within its single swatch box. */
async function verifiesMixedSwatches({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-color-swatch--matrix');
  for (const count of [2, 3, 4]) {
    const mixed = page.getByTestId(`mix-${['', '', 'two', 'three', 'four'][count]}`);
    await expect(mixed).toHaveAttribute('data-value', 'transparent');
    await expect(mixed).toHaveCSS('width', '20px');
    await expect(mixed.locator('[data-value]')).toHaveCount(count);
  }
  await expect(page.getByTestId('mix-three').locator('[data-value]').last()).toHaveCSS(
    'grid-column',
    'span 2 / span 2',
  );
  await page.addStyleTag({
    content: '.leverui-color-swatch__mix-grid { column-gap: 3px; }',
  });
  await expect(page.getByTestId('mix-three').locator('.leverui-color-swatch__mix-grid')).toHaveCSS(
    'column-gap',
    '3px',
  );
  await page.addStyleTag({ content: '#mix-three { --leverui-swatch-color: rebeccapurple; }' });
  const firstColor = await page
    .getByTestId('mix-three')
    .locator('[data-mix-cell]')
    .first()
    .evaluate(
      /** Keep a mix cell's own value ahead of an outer swatch override. */
      (element) => getComputedStyle(element).getPropertyValue('--leverui-swatch-color').trim(),
    );
  expect(firstColor).toBe('red');
}

test('ColorSwatchMix clips two through four colors into one swatch', verifiesMixedSwatches);

/** Verify changing props update existing nodes and CSS overrides take effect. */
async function verifiesReactiveSwatch({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=content-color-swatch--matrix');
  const inherited = page.getByTestId('swatch-inherited');
  const fixed = page.getByTestId('swatch-fixed');
  await expect(inherited).toHaveCSS('width', '16px');
  await expect(fixed).toHaveCSS('width', '18px');
  await inherited.evaluate(
    /** Mark the original element before changing its provider size. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await page.getByTestId('swatch-size-toggle').click();
  await expect(inherited).toHaveAttribute('data-original-node', 'true');
  await expect(inherited).toHaveCSS('width', '24px');
  await expect(fixed).toHaveCSS('width', '18px');

  const changing = page.getByTestId('swatch-reactive');
  await expect(changing).toHaveAttribute('data-value', 'red');
  await page.getByTestId('swatch-color-toggle').click();
  await expect(changing).toHaveAttribute('data-value', 'blue');
  await expect(changing).toHaveCSS('border-radius', '9999px');
  await expect(page.getByTestId('swatch-css')).toHaveCSS('width', '32px');
  await expect(page.getByTestId('swatch-css-background')).toHaveCSS(
    'background-color',
    'rgb(21, 33, 45)',
  );
  await expect(page.getByTestId('swatch-css-background')).toHaveCSS('background-image', 'none');
  await expect(page.locator('#swatch-background-override')).toHaveCSS(
    'background-color',
    'rgb(55, 66, 77)',
  );
  await expect(page.getByTestId('swatch-unstyled')).toHaveCSS('display', 'inline');
  await expect(page.locator('#swatch-css-override')).toHaveCSS(
    '--leverui-swatch-checker-size',
    '4px',
  );
  await expect(page.locator('#swatch-css-override')).toHaveCSS(
    '--leverui-swatch-color',
    'rgb(102, 51, 153)',
  );
  await expect(page.locator('#swatch-css-override')).toHaveCSS(
    'background-image',
    /linear-gradient\(rgb\(102, 51, 153\), rgb\(102, 51, 153\)\)/,
  );
  const lightChecker = await page.getByTestId('swatch-transparent').evaluate(
    /** Read the resolved light checkerboard image. */
    (element) => getComputedStyle(element).backgroundImage,
  );
  const darkChecker = await page.getByTestId('swatch-dark').evaluate(
    /** Read the resolved dark checkerboard image. */
    (element) => getComputedStyle(element).backgroundImage,
  );
  const nestedLightChecker = await page.getByTestId('swatch-nested-light').evaluate(
    /** Read the nearest light-scope checkerboard image. */
    (element) => getComputedStyle(element).backgroundImage,
  );
  expect(darkChecker).not.toBe(lightChecker);
  expect(nestedLightChecker).toBe(lightChecker);
}

test('Color Swatch follows live props and consumer CSS', verifiesReactiveSwatch);

/** Verify recipe sizes and shapes change at the configured viewport boundary. */
async function verifiesResponsiveSwatches({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 720 });
  await page.goto('/iframe.html?id=content-color-swatch--matrix');
  const swatch = page.getByTestId('swatch-responsive');
  const mix = page.getByTestId('mix-responsive');
  await expect(swatch).toHaveCSS('width', '16px');
  await expect(swatch).toHaveCSS('border-radius', '0px');
  await expect(mix).toHaveCSS('width', '16px');
  await expect(mix).toHaveCSS('border-radius', '0px');

  await page.setViewportSize({ width: 900, height: 720 });
  await expect(swatch).toHaveCSS('width', '24px');
  await expect(swatch).toHaveCSS('border-radius', '9999px');
  await expect(mix).toHaveCSS('width', '24px');
  await expect(mix).toHaveCSS('border-radius', '9999px');
  await expect(mix.locator('[data-value]')).toHaveCount(2);
  await expect(swatch).not.toHaveAttribute('size');
  await expect(swatch).not.toHaveAttribute('shape');
}

test('Color Swatch and mix follow responsive size and shape variants', verifiesResponsiveSwatches);
