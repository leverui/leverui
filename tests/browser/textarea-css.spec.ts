import { readFile } from 'node:fs/promises';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test, type Page } from '@playwright/test';
import type { Textarea as TextareaExport, TextareaProps } from '../../src';

const serverEntry = '../../dist/server/index.js';
const { Textarea } = (await import(serverEntry)) as { Textarea: typeof TextareaExport };
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const consumerCss = '.textarea-consumer { color: rgb(12, 34, 56); }';

/** Render responsive Textarea choices without a styling provider. */
function renderTextarea(): string {
  return renderToString(
    /** Keep one native control across the viewport comparisons. */
    () =>
      createComponent(Textarea, {
        id: 'responsive-textarea',
        'aria-label': 'Responsive notes',
        class: 'textarea-consumer',
        rows: 2,
        size: { base: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl', '2xl': 'xs' },
        variant: {
          base: 'outline',
          sm: 'subtle',
          md: 'flushed',
          lg: 'outline',
          xl: 'subtle',
          '2xl': 'flushed',
        },
      } satisfies TextareaProps<'textarea'>),
  );
}

/** Verify authored CSS responds at each supported breakpoint without scripts. */
async function verifiesResponsiveTextarea({ page }: { page: Page }): Promise<void> {
  const markup = renderTextarea();
  expect(markup).toContain('lui-textarea');
  expect(markup).not.toContain('style=""');
  expect(markup).not.toMatch(/\s(?:size|variant|colorPalette)=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style><style>${consumerCss}</style>${markup}`);
  const control = page.locator('#responsive-textarea');
  await expect(control).toHaveCSS('color', 'rgb(12, 34, 56)');
  const cases = [
    { width: 400, padding: '8px', topBorder: '1px' },
    { width: 600, padding: '10px', topBorder: '1px' },
    { width: 900, padding: '0px', topBorder: '0px' },
    { width: 1100, padding: '16px', topBorder: '1px' },
    { width: 1350, padding: '18px', topBorder: '1px' },
    { width: 1600, padding: '0px', topBorder: '0px' },
  ] as const;
  for (const choice of cases) {
    await page.setViewportSize({ width: choice.width, height: 600 });
    await expect(control).toHaveCSS('padding-left', choice.padding);
    await expect(control).toHaveCSS('border-top-width', choice.topBorder);
  }
}

test(
  'Textarea variants respond from CSS without scripts or style tags',
  verifiesResponsiveTextarea,
);

/** Verify unstyled Textarea keeps native semantics and accepts consumer CSS. */
async function verifiesUnstyledTextarea({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render an unstyled control without a styling provider. */
    () =>
      createComponent(Textarea, {
        id: 'unstyled-textarea',
        'aria-label': 'Plain notes',
        class: 'consumer-control',
        unstyled: true,
      }),
  );
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>.consumer-control { border: 3px solid rgb(12, 34, 56); }</style>${markup}`,
  );
  const control = page.locator('#unstyled-textarea');
  await expect(control).toHaveAttribute('data-unstyled', '');
  await expect(control).toHaveAttribute('aria-label', 'Plain notes');
  await expect(control).toHaveCSS('border-top-width', '3px');
}

test('unstyled Textarea retains native semantics and consumer CSS', verifiesUnstyledTextarea);

/** Verify palette choices change the authored focus ring without a provider. */
async function verifiesFocusPalette({ page }: { page: Page }): Promise<void> {
  /** Render one focused control with a selected semantic palette. */
  function specimen(id: string, colorPalette: string): string {
    return renderToString(
      /** Supply the chosen palette to native server markup. */
      () => createComponent(Textarea, { id, colorPalette, 'data-focus-visible': '' }),
    );
  }
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style>${specimen('blue-textarea', 'blue')}${specimen('red-textarea', 'red')}`,
  );
  const blue = page.locator('#blue-textarea');
  const red = page.locator('#red-textarea');
  await expect(blue).toHaveAttribute('data-lui-color-palette', 'blue');
  await expect(red).toHaveAttribute('data-lui-color-palette', 'red');
  const blueRing = await blue.evaluate(
    /** Read the authored focus ring color on the blue control. */
    (element) => getComputedStyle(element).outlineColor,
  );
  const redRing = await red.evaluate(
    /** Read the authored focus ring color on the red control. */
    (element) => getComputedStyle(element).outlineColor,
  );
  expect(blueRing).not.toBe(redRing);
}

test('Textarea color palettes change the authored focus ring', verifiesFocusPalette);
