import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import type {
  Heading as HeadingExport,
  HeadingProps,
  HeadingPropsProvider as DefaultsExport,
} from '../../src';

type ServerExports = {
  Heading: typeof HeadingExport;
  HeadingPropsProvider: typeof DefaultsExport;
};

const serverEntry = '../../dist/server/index.js';
const { Heading, HeadingPropsProvider } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const sizes = [
  ['xs', '12px', '16px'],
  ['sm', '14px', '20px'],
  ['md', '16px', '24px'],
  ['lg', '18px', '28px'],
  ['xl', '20px', '30px'],
  ['2xl', '24px', '32px'],
  ['3xl', '30px', '38px'],
  ['4xl', '36px', '44px'],
  ['5xl', '48px', '60px'],
  ['6xl', '60px', '72px'],
  ['7xl', '72px', '92px'],
] as const;

/** Render the finite size scale, provider default, and consumer hooks on the server. */
function renderHeadingExamples(): string {
  return renderToString(
    /** Keep every heading under the published provider. */
    () => [
      createComponent(Heading, { id: 'default-heading', children: 'Default' }),
      ...sizes.map(
        /** Render one finite size without a style-object prop. */
        ([size]) => createComponent(Heading, { id: `heading-${size}`, size, children: size }),
      ),
      createComponent(Heading, {
        id: 'responsive-heading',
        size: { base: '4xl', sm: 'xs', md: '2xl', lg: 'sm', xl: '5xl', '2xl': 'md' },
        children: 'Responsive',
      } satisfies HeadingProps<'h2'>),
      createComponent(Heading, {
        id: 'array-heading',
        size: ['lg', null, '2xl'],
        children: 'Responsive array',
      } satisfies HeadingProps<'h2'>),
      createComponent(Heading, {
        id: 'no-base-heading',
        size: { md: 'lg' },
        children: 'No base',
      } satisfies HeadingProps<'h2'>),
      createComponent(HeadingPropsProvider, {
        value: { size: '2xl' },
        /** Inherit the provider's finite size on the native path. */
        get children() {
          return createComponent(Heading, { id: 'inherited-heading', children: 'Inherited' });
        },
      }),
      createComponent(Heading, {
        id: 'consumer-heading',
        class: 'consumer-heading',
        children: 'Consumer',
      }),
      createComponent(Heading, {
        id: 'unstyled-heading',
        size: 'lg',
        unstyled: true,
        children: 'Unstyled',
      } satisfies HeadingProps<'h2'>),
    ],
  );
}

/** Verify CSS sizes and consumer overrides in prerendered markup without scripts. */
async function verifiesHeadingCss({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  const markup = renderHeadingExamples();
  expect(markup).not.toMatch(/id="default-heading"[^>]*style=/);
  await page.setContent(
    `<style>${defaultCss}</style><style>.consumer-heading { font-size: 26px; font-weight: 300; }</style>${markup}`,
  );
  const defaultHeading = page.locator('#default-heading');
  await expect(defaultHeading).toHaveCSS('font-size', '20px');
  await expect(defaultHeading).toHaveCSS('font-weight', '600');
  await expect(defaultHeading).toHaveAttribute('data-size', 'xl');
  for (const [size, fontSize, lineHeight] of sizes) {
    const heading = page.locator(`#heading-${size}`);
    await expect(heading).toHaveCSS('font-size', fontSize);
    await expect(heading).toHaveCSS('line-height', lineHeight);
    await expect(heading).toHaveAttribute('data-size', size);
  }
  await expect(page.locator('#inherited-heading')).toHaveCSS('font-size', '24px');
  await expect(page.locator('#consumer-heading')).toHaveCSS('font-size', '26px');
  await expect(page.locator('#consumer-heading')).toHaveCSS('font-weight', '300');
  await expect(page.locator('#unstyled-heading')).not.toHaveCSS('font-size', '18px');
  const responsive = page.locator('#responsive-heading');
  await expect(responsive).toHaveAttribute('data-size-md', '2xl');
  await expect(responsive).not.toHaveAttribute('data-lui-private-style-runtime');
  const arrayHeading = page.locator('#array-heading');
  await expect(arrayHeading).toHaveAttribute('data-size-md', '2xl');
  const noBaseHeading = page.locator('#no-base-heading');
  await expect(noBaseHeading).not.toHaveAttribute('data-size');
  for (const [width, fontSize, lineHeight, letterSpacing] of [
    [400, '36px', '44px', '-0.9px'],
    [600, '12px', '16px', '-0.3px'],
    [900, '24px', '32px', '-0.6px'],
    [1100, '14px', '20px', '-0.35px'],
    [1300, '48px', '60px', '-1.2px'],
    [1600, '16px', '24px', '-0.4px'],
  ] as const) {
    await page.setViewportSize({ width, height: 800 });
    await expect(responsive).toHaveCSS('font-size', fontSize);
    await expect(responsive).toHaveCSS('line-height', lineHeight);
    await expect(responsive).toHaveCSS('letter-spacing', letterSpacing);
    await expect(arrayHeading).toHaveCSS('font-size', width < 768 ? '18px' : '24px');
    await expect(noBaseHeading).toHaveCSS('font-size', width < 768 ? '16px' : '18px');
  }
}

test('Heading sizes and overrides render from CSS without scripts', verifiesHeadingCss);
