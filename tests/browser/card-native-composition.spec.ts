import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString, type JSX } from '@solidjs/web';
import type { RenderChild } from '../../src/styled-system/child-props';
import type { CardRoot as CardRootExport } from '../../src/components/card-root';
import type { CardTitle as CardTitleExport } from '../../src/components/card-title';
import type { CardBody as CardBodyExport } from '../../src/components/card-body';
import type { CardBodyProps, CardRootProps } from '../../src/components/card-props';

type GetChildProps = Parameters<RenderChild>[0];

const serverEntry = '../../dist/server/index.js';
const { CardRoot, CardTitle, CardBody } = (await import(serverEntry)) as {
  CardRoot: typeof CardRootExport;
  CardTitle: typeof CardTitleExport;
  CardBody: typeof CardBodyExport;
};
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render a caller-owned root with its own class and Card attributes. */
function renderOwnedRoot(getProps: GetChildProps): JSX.Element {
  return createComponent(Dynamic, {
    component: 'article',
    ...getProps({ class: 'owned-card' }),
    id: 'owned-card',
  });
}

/** Render a caller-owned heading with the Card title hook. */
function renderOwnedTitle(getProps: GetChildProps): JSX.Element {
  return createComponent(Dynamic, {
    component: 'h2',
    ...getProps(),
    id: 'owned-title',
  });
}

/** Render selected and caller-owned Card parts without a runtime provider. */
function renderCards(): JSX.Element {
  return [
    createComponent<CardRootProps<'section'>>(CardRoot, {
      id: 'selected-card',
      as: 'section',
      size: 'lg',
      /** Keep the selected body under its Card root. */
      get children() {
        return createComponent<CardBodyProps<'main'>>(CardBody, {
          id: 'selected-body',
          as: 'main',
          children: 'Selected body',
        });
      },
    }),
    createComponent<CardRootProps>(CardRoot, {
      asChild: renderOwnedRoot,
      size: 'sm',
      class: 'custom-card',
      /** Keep the caller-owned title under its Card root. */
      get children() {
        return createComponent(CardTitle, {
          asChild: renderOwnedTitle,
          children: 'Owned title',
        });
      },
    }),
  ];
}

/** Verify server markup and published CSS for selected and caller-owned tags. */
async function verifiesNativeCardComposition({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderCards);
  expect(markup).toMatch(/<section[^>]*id="selected-card"/);
  expect(markup).toMatch(/<main[^>]*id="selected-body"/);
  expect(markup).toMatch(/<article[^>]*id="owned-card"/);
  expect(markup).toMatch(/<h2[^>]*id="owned-title"/);
  expect(markup).not.toContain('data-leverui-private-style-runtime');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  await expect(page.locator('#selected-card')).toHaveCSS('display', 'flex');
  await expect(page.locator('#selected-body')).toHaveCSS('padding-top', '28px');
  await expect(page.locator('#owned-card')).toHaveCSS('display', 'flex');
  await expect(page.locator('#owned-card')).toHaveCSS('--leverui-card-padding', '1rem');
  await expect(page.locator('#owned-title')).toHaveCSS('font-weight', '600');
  await expect(page.locator('#owned-card')).toHaveClass(/owned-card/);
  await expect(page.locator('#owned-card')).toHaveClass(/custom-card/);
}

test('selected and caller-owned Cards use published CSS', verifiesNativeCardComposition);
