import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { CardRoot as CardRootExport } from '../../src/components/card-root';
import type { CardRootProps } from '../../src/components/card-props';
import type { CardHeader as CardHeaderExport } from '../../src/components/card-header';
import type { CardBody as CardBodyExport } from '../../src/components/card-body';
import type { CardFooter as CardFooterExport } from '../../src/components/card-footer';
import type { CardTitle as CardTitleExport } from '../../src/components/card-title';
import type { CardDescription as CardDescriptionExport } from '../../src/components/card-description';

const serverEntry = '../../dist/server/index.js';
const { CardRoot, CardHeader, CardBody, CardFooter, CardTitle, CardDescription } = (await import(
  serverEntry
)) as {
  CardRoot: typeof CardRootExport;
  CardHeader: typeof CardHeaderExport;
  CardBody: typeof CardBodyExport;
  CardFooter: typeof CardFooterExport;
  CardTitle: typeof CardTitleExport;
  CardDescription: typeof CardDescriptionExport;
};
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render one finite Card root without a styling provider or client script. */
function renderRoot(
  id: string,
  size: 'sm' | 'md' | 'lg',
  variant: 'outline' | 'elevated' | 'subtle',
): JSX.Element {
  return createComponent(CardRoot, { id, size, variant, children: id });
}

/** Check server markup and the published CSS for each authored root treatment. */
async function verifiesCardRootCss({ page }: { page: Page }): Promise<void> {
  const markup = [
    ['small-outline', 'sm', 'outline'],
    ['medium-elevated', 'md', 'elevated'],
    ['large-subtle', 'lg', 'subtle'],
  ] as const;
  const html = markup
    .map(
      /** Serialize each native root from the server entry. */
      ([id, size, variant]) =>
        renderToString(
          /** Render the selected root under the server owner. */
          () => renderRoot(id, size, variant),
        ),
    )
    .join('');
  expect(html).not.toContain('data-leverui-private-style-runtime');
  await page.setContent(`<style>${defaultCss}</style>${html}`);
  await expect(page.locator('#small-outline')).toHaveCSS('display', 'flex');
  await expect(page.locator('#small-outline')).toHaveCSS('border-top-width', '1px');
  await expect(page.locator('#small-outline')).toHaveCSS('--leverui-card-padding', '1rem');
  await expect(page.locator('#medium-elevated')).not.toHaveCSS('box-shadow', 'none');
  await expect(page.locator('#large-subtle')).toHaveCSS('background-color', 'rgb(244, 244, 245)');
  await expect(page.locator('#large-subtle')).toHaveCSS('--leverui-card-padding', '1.75rem');
}

test('Card roots use published CSS without a provider or client script', verifiesCardRootCss);

/** Render all default Card parts under their nearest root context. */
function renderCompleteCard(): JSX.Element {
  return createComponent(CardRoot, {
    id: 'complete-card',
    /** Mount parts while the nearest Card context is active. */
    get children() {
      return [
        createComponent(CardHeader, {
          id: 'card-header',
          /** Keep title and description in the native header. */
          get children() {
            return [
              createComponent(CardTitle, { id: 'card-title', children: 'Project' }),
              createComponent(CardDescription, { id: 'card-description', children: 'Details' }),
            ];
          },
        }),
        createComponent(CardBody, { id: 'card-body', children: 'Content' }),
        createComponent(CardFooter, { id: 'card-footer', children: 'Actions' }),
      ];
    },
  });
}

/** Verify a complete server-rendered Card uses no presentation runtime. */
async function verifiesCompleteCardCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderCompleteCard);
  expect(markup).not.toContain('data-leverui-private-style-runtime');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  await expect(page.locator('#card-header')).toHaveCSS('padding-top', '24px');
  await expect(page.locator('#card-header')).toHaveCSS('gap', '6px');
  await expect(page.locator('#card-body')).toHaveCSS('flex-grow', '1');
  await expect(page.locator('#card-footer')).toHaveCSS('gap', '8px');
  await expect(page.locator('#card-title')).toHaveCSS('font-size', '18px');
  await expect(page.locator('#card-description')).toHaveCSS('font-size', '14px');
}

test(
  'complete Card uses published CSS without a provider or client script',
  verifiesCompleteCardCss,
);

/** Render every breakpoint choice through native Card attributes. */
function renderResponsiveCard(): JSX.Element {
  return createComponent(CardRoot, {
    id: 'responsive-card',
    size: { base: 'sm', sm: 'md', md: 'lg', lg: 'sm', xl: 'md', '2xl': 'lg' },
    variant: {
      base: 'elevated',
      sm: 'outline',
      md: 'subtle',
      lg: 'elevated',
      xl: 'outline',
      '2xl': 'subtle',
    },
    /** Keep the title under the root's responsive typography variables. */
    get children() {
      return createComponent(CardTitle, { id: 'responsive-card-title', children: 'Responsive' });
    },
  } satisfies CardRootProps);
}

/** Check all breakpoints and the additive treatment cascade without scripts. */
async function verifiesResponsiveCardCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderResponsiveCard);
  expect(markup).toContain('data-size-2xl="lg"');
  expect(markup).toContain('data-variant-2xl="subtle"');
  expect(markup).not.toContain('data-leverui-private-style-runtime');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const card = page.locator('#responsive-card');
  for (const [width, padding, background] of [
    [400, '1rem', 'rgb(255, 255, 255)'],
    [500, '1.5rem', 'rgb(255, 255, 255)'],
    [800, '1.75rem', 'rgb(244, 244, 245)'],
    [1100, '1rem', 'rgb(255, 255, 255)'],
    [1300, '1.5rem', 'rgb(255, 255, 255)'],
    [1600, '1.75rem', 'rgb(244, 244, 245)'],
  ] as const) {
    await page.setViewportSize({ width, height: 720 });
    await expect(card).toHaveCSS('--leverui-card-padding', padding);
    await expect(card).toHaveCSS('background-color', background);
  }
  await page.setViewportSize({ width: 800, height: 720 });
  await expect(card).toHaveCSS('border-top-width', '1px');
  await expect(card).not.toHaveCSS('box-shadow', 'none');
  await expect(page.locator('#responsive-card-title')).toHaveCSS('font-size', '20px');
}

test('responsive Card choices use published CSS at every breakpoint', verifiesResponsiveCardCss);

/** Render nested native roots so each title reads its nearest size variables. */
function renderNestedCards(): JSX.Element {
  return createComponent(CardRoot, {
    id: 'outer-card',
    size: 'sm',
    /** Mount the inner Card inside the outer body. */
    get children() {
      return createComponent(CardBody, {
        /** Keep both titles mounted under their respective roots. */
        get children() {
          return [
            createComponent(CardTitle, { id: 'outer-title', children: 'Outer' }),
            createComponent(CardRoot, {
              id: 'inner-card',
              size: 'md',
              /** Give the inner root its own title. */
              get children() {
                return createComponent(CardTitle, { id: 'inner-title', children: 'Inner' });
              },
            } satisfies CardRootProps),
          ];
        },
      });
    },
  } satisfies CardRootProps);
}

/** Confirm nested Card typography follows the closest root without scripts. */
async function verifiesNestedCardCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderNestedCards);
  expect(markup).not.toContain('data-leverui-private-style-runtime');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  await expect(page.locator('#outer-title')).toHaveCSS('font-size', '16px');
  await expect(page.locator('#inner-title')).toHaveCSS('font-size', '18px');
}

test('nested Card titles use their nearest root CSS variables', verifiesNestedCardCss);
