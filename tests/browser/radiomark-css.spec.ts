import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type { Radiomark as RadiomarkExport, RadiomarkProps } from '../../src';

const serverEntry = '../../dist/server/index.js';
const { Radiomark } = (await import(serverEntry)) as { Radiomark: typeof RadiomarkExport };
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render a native mark without the styling provider or browser scripts. */
function specimen(
  props: RadiomarkProps<'span'> & Partial<Record<'data-invalid' | 'data-focus-visible', string>>,
): string {
  return renderToString(
    /** Keep the server output independent of runtime recipe generation. */
    () => createComponent(Radiomark, props),
  );
}

/** Read the finite visual properties controlled by Radiomark CSS. */
async function appearance(page: Page, id: string): Promise<Record<string, string>> {
  return page.locator(`#${id}`).evaluate(
    /** Compare computed properties rather than authored selector text. */
    (element) => {
      const style = getComputedStyle(element);
      return {
        width: style.width,
        color: style.color,
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor,
      };
    },
  );
}

/** Compare responsive marks with equivalent direct selections at each breakpoint. */
async function verifiesResponsiveCss({ page }: { page: Page }): Promise<void> {
  const responsive = specimen({
    id: 'responsive-mark',
    checked: true,
    size: { base: 'xs', sm: 'sm', md: 'lg', lg: 'md', xl: 'xs', '2xl': 'lg' },
    variant: { base: 'solid', md: 'outline', lg: 'subtle', xl: 'inverted' },
    filled: { base: true, md: false, xl: true, '2xl': false },
  });
  const cases = [
    { width: 400, size: 'xs', variant: 'solid', filled: true },
    { width: 600, size: 'sm', variant: 'solid', filled: true },
    { width: 900, size: 'lg', variant: 'outline', filled: false },
    { width: 1100, size: 'md', variant: 'subtle', filled: false },
    { width: 1300, size: 'xs', variant: 'inverted', filled: true },
    { width: 1600, size: 'lg', variant: 'inverted', filled: false },
  ] as const;
  const direct = cases.map(
    /** Render each expected scalar treatment for a viewport. */
    ({ width, size, variant, filled }) =>
      specimen({ id: `direct-${width}`, checked: true, size, variant, filled }),
  );
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${responsive}${direct.join('')}`);
  await expect(page.locator('#responsive-mark')).toHaveAttribute('data-filled-2xl', 'false');
  for (const { width } of cases) {
    await page.setViewportSize({ width, height: 600 });
    expect(await appearance(page, 'responsive-mark')).toEqual(
      await appearance(page, `direct-${width}`),
    );
  }
}

test('Radiomark responsive CSS works without scripts or provider', verifiesResponsiveCss);

/** Keep explicit false fill overrides aligned with unchecked variant surfaces. */
async function verifiesUncheckedFill({ page }: { page: Page }): Promise<void> {
  const responsive = specimen({
    id: 'unchecked-responsive',
    variant: { base: 'subtle', md: 'inverted' },
    filled: { base: true, md: false },
  });
  const subtle = specimen({ id: 'unchecked-subtle', variant: 'subtle', filled: true });
  const inverted = specimen({ id: 'unchecked-inverted', variant: 'inverted', filled: false });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${responsive}${subtle}${inverted}`);
  await page.setViewportSize({ width: 600, height: 600 });
  expect(await appearance(page, 'unchecked-responsive')).toEqual(
    await appearance(page, 'unchecked-subtle'),
  );
  await page.setViewportSize({ width: 900, height: 600 });
  expect(await appearance(page, 'unchecked-responsive')).toEqual(
    await appearance(page, 'unchecked-inverted'),
  );
}

test('Radiomark resets filled backgrounds on unchecked responsive marks', verifiesUncheckedFill);

/** Verify palette, unstyled hooks, consumer overrides, and invalid styling. */
async function verifiesConsumerCss({ page }: { page: Page }): Promise<void> {
  const blue = specimen({ id: 'blue-mark', checked: true, colorPalette: 'blue' });
  const red = specimen({ id: 'red-mark', checked: true, colorPalette: 'red' });
  const custom = specimen({
    id: 'custom-mark',
    checked: true,
    colorPalette: 'blue',
    class: 'consumer-palette',
  });
  const plain = specimen({
    id: 'unstyled-mark',
    checked: true,
    unstyled: true,
    class: 'consumer-mark',
    'aria-label': 'Selected',
  });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>
      .consumer-mark { color: rgb(12, 34, 56); }
      .consumer-palette {
        --leverui-colors-color-palette-solid: rgb(12, 34, 56);
        --leverui-radii-full: 7px;
      }
      .leverui-radiomark__dot { scale: 0.8; }
    </style>${blue}${red}${custom}${plain}`,
  );
  expect((await appearance(page, 'blue-mark')).backgroundColor).not.toBe(
    (await appearance(page, 'red-mark')).backgroundColor,
  );
  await expect(page.locator('#custom-mark')).toHaveCSS('background-color', 'rgb(12, 34, 56)');
  await expect(page.locator('#custom-mark')).toHaveCSS('border-radius', '7px');
  await expect(page.locator('#custom-mark .leverui-radiomark__dot')).toHaveCSS('scale', '0.8');
  await expect(page.locator('#custom-mark .leverui-radiomark__dot')).toHaveCSS(
    'border-radius',
    '7px',
  );
  const unstyled = page.locator('#unstyled-mark');
  await expect(unstyled).toHaveAttribute('data-checked', '');
  await expect(unstyled).toHaveAttribute('aria-label', 'Selected');
  await expect(unstyled.locator('.leverui-radiomark__dot')).toHaveCount(1);
  await expect(unstyled).toHaveCSS('color', 'rgb(12, 34, 56)');
}

test('Radiomark consumer CSS and unstyled state work without a provider', verifiesConsumerCss);

/** Verify authored invalid borders and palette focus rings on native marks. */
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
    id: 'invalid-default',
    checked: true,
    'data-invalid': '',
  });
  const explicit = specimen({
    id: 'invalid-blue',
    checked: true,
    colorPalette: 'blue',
    'data-invalid': '',
  });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${blue}${red}${invalid}${explicit}`);
  const blueRing = await page.locator('#blue-focus').evaluate(
    /** Read the authored palette-dependent outline color. */
    (element) => getComputedStyle(element).outlineColor,
  );
  const redRing = await page.locator('#red-focus').evaluate(
    /** Read the second palette's outline color. */
    (element) => getComputedStyle(element).outlineColor,
  );
  expect(blueRing).not.toBe(redRing);
  await expect(page.locator('#blue-focus')).toHaveCSS('outline-width', '2px');
  expect((await appearance(page, 'invalid-default')).backgroundColor).not.toBe(
    (await appearance(page, 'blue-focus')).backgroundColor,
  );
  expect((await appearance(page, 'invalid-default')).borderColor).not.toBe(
    (await appearance(page, 'blue-focus')).borderColor,
  );
  expect((await appearance(page, 'invalid-blue')).backgroundColor).toBe(
    (await appearance(page, 'blue-focus')).backgroundColor,
  );
}

test('Radiomark invalid and focus states use authored CSS', verifiesFocusAndInvalid);
