import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { CardRoot as CardRootExport } from '../../src/components/card-root';
import type { CardTitle as CardTitleExport } from '../../src/components/card-title';
import type { CardBody as CardBodyExport } from '../../src/components/card-body';
import type { CardRootProps } from '../../src/components/card-props';

const serverEntry = '../../dist/server/index.js';
const { CardRoot, CardTitle, CardBody } = (await import(serverEntry)) as {
  CardRoot: typeof CardRootExport;
  CardTitle: typeof CardTitleExport;
  CardBody: typeof CardBodyExport;
};
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const consumerCss = await readFile(
  new URL('../../tests/packed-consumer/src/card.css', import.meta.url),
  'utf8',
);

/** Render the packed consumer's class and a neighboring default Card. */
function renderConsumerCards(): JSX.Element {
  return [
    createComponent<CardRootProps>(CardRoot, {
      id: 'packed-custom-card',
      class: 'packed-custom-card',
      /** Mount the title and body beneath the customized root. */
      get children() {
        return [
          createComponent(CardTitle, { id: 'packed-custom-card-title', children: 'Custom card' }),
          createComponent(CardBody, { id: 'packed-custom-card-body', children: 'Custom body' }),
        ];
      },
    }),
    createComponent<CardRootProps>(CardRoot, {
      id: 'packed-custom-override',
      variant: 'outline',
      size: 'sm',
      /** Keep the neighboring Card on its documented native selectors. */
      get children() {
        return createComponent(CardBody, {
          id: 'packed-custom-override-body',
          children: 'Default body',
        });
      },
    }),
  ];
}

/** Verify consumer CSS reproduces the former custom Card recipe without scripts. */
async function verifiesConsumerCardCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderConsumerCards);
  expect(markup).not.toContain('data-lui-private-style-runtime');
  await page.setContent(`<style>${defaultCss}</style><style>${consumerCss}</style>${markup}`);
  await expect(page.locator('#packed-custom-card')).toHaveCSS(
    'background-image',
    /linear-gradient/,
  );
  await expect(page.locator('#packed-custom-card')).toHaveCSS('border-top-width', '0px');
  await expect(page.locator('#packed-custom-card-body')).toHaveCSS('padding-top', '40px');
  await expect(page.locator('#packed-custom-card-title')).toHaveCSS('font-size', '24px');
  await expect(page.locator('#packed-custom-override-body')).toHaveCSS('padding-top', '16px');
}

test('consumer CSS replaces the custom Card recipe', verifiesConsumerCardCss);
