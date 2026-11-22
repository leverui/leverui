import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { CardRoot as CardRootExport } from '../../src/components/card-root';
import type { CardRootProps } from '../../src/components/card-props';
import type { CardTitle as CardTitleExport } from '../../src/components/card-title';
import type { CardBody as CardBodyExport } from '../../src/components/card-body';

const serverEntry = '../../dist/server/index.js';
const { CardRoot, CardTitle, CardBody } = (await import(serverEntry)) as {
  CardRoot: typeof CardRootExport;
  CardTitle: typeof CardTitleExport;
  CardBody: typeof CardBodyExport;
};
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render one responsive Card with native parts for script-free CSS checks. */
function renderCard(id: string, sparse = false): JSX.Element {
  return createComponent(CardRoot, {
    id,
    size: sparse
      ? { lg: 'lg' }
      : { base: 'sm', sm: 'md', md: 'lg', lg: 'sm', xl: 'md', '2xl': 'lg' },
    variant: sparse
      ? { md: 'subtle' }
      : {
          base: 'elevated',
          sm: 'outline',
          md: 'subtle',
          lg: 'elevated',
          xl: 'outline',
          '2xl': 'subtle',
        },
    /** Mount both parts under the nearest Card root. */
    get children() {
      return [
        createComponent(CardTitle, { id: `${id}-title`, children: 'Heading' }),
        createComponent(CardBody, { id: `${id}-body`, children: 'Content' }),
      ];
    },
  } satisfies CardRootProps);
}

/** Verify responsive Card treatments preserve properties absent from later variants. */
async function verifiesResponsiveCardCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render complete and sparse responsive selections without a provider. */
    () => [renderCard('complete-card'), renderCard('sparse-card', true)],
  );
  expect(markup).toContain('data-variant-2xl="subtle"');
  expect(markup).not.toContain('data-leverui-private-style-runtime');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const complete = page.locator('#complete-card');
  const sparse = page.locator('#sparse-card');
  for (const [width, border] of [
    [400, '0px'],
    [500, '1px'],
    [800, '1px'],
    [1100, '1px'],
    [1300, '1px'],
    [1600, '1px'],
  ] as const) {
    await page.setViewportSize({ width, height: 720 });
    await expect(complete).toHaveCSS('border-top-width', border);
    await expect(complete).not.toHaveCSS('box-shadow', 'none');
  }
  await page.setViewportSize({ width: 400, height: 720 });
  await expect(sparse).toHaveCSS('border-top-width', '1px');
  await expect(page.locator('#sparse-card-title')).toHaveCSS('font-size', '18px');
  await page.setViewportSize({ width: 900, height: 720 });
  await expect(sparse).toHaveCSS('border-top-width', '1px');
  await expect(sparse).toHaveCSS('box-shadow', 'none');
  await page.setViewportSize({ width: 1100, height: 720 });
  await expect(page.locator('#sparse-card-title')).toHaveCSS('font-size', '20px');
}

test(
  'Card responsive CSS follows the treatment cascade without scripts',
  verifiesResponsiveCardCss,
);
