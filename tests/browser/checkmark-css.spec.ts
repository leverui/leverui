import { expect, test, type Page } from '@playwright/test';
import type { CheckmarkProps } from '../../src';
import { appearance, defaultCss, specimen } from './checkmark-css-support';

/** Compare responsive CSS with equivalent scalar Checkmarks at each width. */
async function verifiesResponsiveCss({ page }: { page: Page }): Promise<void> {
  const responsive = specimen({
    id: 'responsive-checkmark',
    checked: true,
    size: { base: 'xs', sm: 'sm', md: 'lg', lg: 'md', xl: 'xs', '2xl': 'lg' },
    variant: {
      base: 'solid',
      md: 'outline',
      lg: 'subtle',
      xl: 'plain',
      '2xl': 'inverted',
    },
    filled: { base: true, md: false, xl: true },
  } satisfies CheckmarkProps<'svg'>);
  const cases = [
    { width: 400, size: 'xs', variant: 'solid', filled: true },
    { width: 600, size: 'sm', variant: 'solid', filled: true },
    { width: 900, size: 'lg', variant: 'outline', filled: false },
    { width: 1100, size: 'md', variant: 'subtle', filled: false },
    { width: 1300, size: 'xs', variant: 'plain', filled: true },
    { width: 1600, size: 'lg', variant: 'inverted', filled: true },
  ] as const;
  const scalars = cases.map(
    /** Render one direct CSS selection for each responsive state. */
    ({ width, size, variant, filled }) =>
      specimen({ id: `scalar-${width}`, checked: true, size, variant, filled }),
  );
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${responsive}${scalars.join('')}`);
  const control = page.locator('#responsive-checkmark');
  await expect(control).toHaveAttribute('data-size-md', 'lg');
  await expect(control).toHaveAttribute('data-variant-xl', 'plain');
  await expect(control).toHaveAttribute('data-filled-md', 'false');
  for (const choice of cases) {
    await page.setViewportSize({ width: choice.width, height: 600 });
    expect(await appearance(page, 'responsive-checkmark')).toEqual(
      await appearance(page, `scalar-${choice.width}`),
    );
  }
}

test('Checkmark responsive choices render from CSS without scripts', verifiesResponsiveCss);

/** Verify palette selection and unstyled SVG semantics in server markup. */
async function verifiesPaletteAndUnstyled({ page }: { page: Page }): Promise<void> {
  const blue = specimen({ id: 'blue-checkmark', checked: true, colorPalette: 'blue' });
  const red = specimen({ id: 'red-checkmark', checked: true, colorPalette: 'red' });
  const custom = specimen({
    id: 'custom-checkmark',
    checked: true,
    colorPalette: 'blue',
    class: 'consumer-palette',
  });
  const plain = specimen({
    id: 'unstyled-checkmark',
    checked: true,
    unstyled: true,
    class: 'consumer-checkmark',
    'aria-label': 'Selected',
  });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>.consumer-checkmark { color: rgb(12, 34, 56); } .consumer-palette { --leverui-colors-color-palette-solid: rgb(12, 34, 56); }</style>${blue}${red}${custom}${plain}`,
  );
  const blueColor = await appearance(page, 'blue-checkmark');
  const redColor = await appearance(page, 'red-checkmark');
  expect(blueColor.backgroundColor).not.toBe(redColor.backgroundColor);
  await expect(page.locator('#custom-checkmark')).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  const unstyled = page.locator('#unstyled-checkmark');
  await expect(unstyled).toHaveAttribute('data-state', 'checked');
  await expect(unstyled).toHaveAttribute('aria-label', 'Selected');
  await expect(unstyled.locator('polyline')).toHaveCount(1);
  await expect(unstyled).toHaveCSS('color', 'rgb(12, 34, 56)');
}

test('Checkmark palettes and unstyled SVG work without a provider', verifiesPaletteAndUnstyled);

/** Verify authored invalid borders and palette focus rings on native SVGs. */
async function verifiesFocusAndInvalid({ page }: { page: Page }): Promise<void> {
  const blue = specimen({
    id: 'blue-focus',
    checked: true,
    colorPalette: 'blue',
    'data-focus-visible': '',
  });
  const red = specimen({
    id: 'red-focus',
    checked: true,
    colorPalette: 'red',
    'data-focus-visible': '',
  });
  const invalid = specimen({
    id: 'invalid-checkmark',
    checked: true,
    colorPalette: 'blue',
    'data-invalid': '',
  });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${blue}${red}${invalid}`);
  /** Read one specimen's palette-dependent focus ring. */
  const readRing = async (id: string): Promise<string> =>
    page.locator(`#${id}`).evaluate(
      /** Read the computed outline color from authored CSS. */
      (element) => getComputedStyle(element).outlineColor,
    );
  expect(await readRing('blue-focus')).not.toBe(await readRing('red-focus'));
  await expect(page.locator('#blue-focus')).toHaveCSS('outline-width', '2px');
  const blueBorder = (await appearance(page, 'blue-focus')).borderColor;
  const invalidBorder = (await appearance(page, 'invalid-checkmark')).borderColor;
  expect(invalidBorder).not.toBe(blueBorder);
}

test('Checkmark invalid and focus states use authored CSS', verifiesFocusAndInvalid);
