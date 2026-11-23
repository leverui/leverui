import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Flex as FlexExport } from '../../src';

type ServerExports = {
  Flex: typeof FlexExport;
};

const serverEntry = '../../dist/server/index.js';
const { Flex } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Require a rendered box before comparing flex item positions. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected Flex layout box is absent.');
  return box;
}

/** Compare positions with a tolerance for subpixel browser rounding. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Verify alias styles, child layout, native paths, and consumer overrides. */
async function verifiesFlex({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-flex--contract');
  const root = page.getByTestId('flex-default');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveCSS('display', 'flex');
  await expect(root).toHaveCSS('gap', '16px');
  await expect(root).toHaveClass(/lui-flex/);
  const first = await requiredBox(page.getByTestId('flex-first-item'));
  const second = await requiredBox(page.getByTestId('flex-second-item'));
  expectNear(second.x - first.x - first.width, 16);
  await expect(page.getByTestId('flex-inline')).toHaveCSS('display', 'inline-flex');

  const aliases = page.getByTestId('flex-aliases');
  await expect(aliases).toHaveCSS('flex-direction', 'column');
  await expect(aliases).toHaveCSS('align-items', 'center');
  await expect(aliases).toHaveCSS('justify-content', 'space-between');
  await expect(aliases).toHaveCSS('flex-wrap', 'wrap');
  await expect(aliases).toHaveCSS('flex-basis', '40px');
  await expect(aliases).toHaveCSS('flex-grow', '2');
  await expect(aliases).toHaveCSS('flex-shrink', '0');
  const aliasRoot = await requiredBox(aliases);
  const aliasFirst = await requiredBox(page.getByTestId('flex-alias-first'));
  const aliasSecond = await requiredBox(page.getByTestId('flex-alias-second'));
  expectNear(aliasFirst.x + aliasFirst.width / 2, aliasRoot.x + aliasRoot.width / 2);
  expectNear(aliasSecond.y + aliasSecond.height, aliasRoot.y + aliasRoot.height);
  for (const name of ['align', 'justify', 'wrap', 'direction', 'basis', 'grow', 'shrink']) {
    await expect(aliases).not.toHaveAttribute(name);
  }

  const responsive = page.getByTestId('flex-responsive');
  await expect(responsive).toHaveCSS('flex-direction', 'row');
  await expect(page.getByTestId('flex-token-basis')).toHaveCSS('flex-basis', '40px');
  await page.addStyleTag({
    content: '.lui-flex[data-testid="flex-token-basis"] { --lui-sizes-10: 52px; }',
  });
  await expect(page.getByTestId('flex-token-basis')).toHaveCSS('flex-basis', '52px');
  const wrapFirst = await requiredBox(page.getByTestId('flex-wrap-first'));
  const wrapThird = await requiredBox(page.getByTestId('flex-wrap-third'));
  expect(wrapThird.y).toBeGreaterThan(wrapFirst.y);
  const orderFirst = await requiredBox(page.getByTestId('flex-order-first'));
  const orderLater = await requiredBox(page.getByTestId('flex-order-later'));
  expect(orderFirst.x).toBeLessThan(orderLater.x);
  const marginRoot = await requiredBox(page.getByTestId('flex-auto-margin'));
  const autoFirst = await requiredBox(page.getByTestId('flex-auto-first'));
  const autoItem = await requiredBox(page.getByTestId('flex-auto-item'));
  expect(autoFirst.height).toBeGreaterThan(10);
  expectNear(autoItem.x + autoItem.width, marginRoot.x + marginRoot.width);
  await expect(page.getByTestId('flex-class-override')).toHaveCSS('flex-direction', 'row');
  await expect(page.getByTestId('flex-position-override')).toHaveCSS('position', 'fixed');
  await expect(page.getByTestId('flex-position-override')).toHaveCSS('flex-direction', 'column');
  await expect(page.getByTestId('flex-unstyled')).toHaveCSS('display', 'flex');
  await expect(page.getByTestId('flex-unstyled-inline')).toHaveCSS('display', 'inline-flex');
  await expect(page.getByTestId('flex-unstyled-inline')).toHaveCSS('flex-direction', 'column');

  const reactive = page.getByRole('button', { name: 'Change flex direction' });
  const child = page.getByTestId('flex-reactive-child');
  await expect(reactive).toHaveAttribute('data-ref-tag', 'button');
  await expect(reactive).toHaveCSS('flex-direction', 'row');
  await reactive.evaluate(
    /** Mark the native root before a reactive style update. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await child.evaluate(
    /** Mark the child before a reactive style update. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await reactive.click();
  await expect(reactive).toHaveCSS('display', 'inline-flex');
  await expect(reactive).toHaveCSS('flex-direction', 'column');
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(child).toHaveAttribute('data-original-node', 'true');
  await reactive.focus();
  await expect(reactive).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(reactive).toHaveCSS('flex-direction', 'row');

  const link = page.getByRole('link', { name: 'Flex link' });
  await expect(link).toHaveCSS('display', 'inline-flex');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#flex-target$/);

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(responsive).toHaveCSS('flex-direction', 'column');
  await page.addStyleTag({ content: '.lui-flex[data-testid="flex-default"] { gap: 21px; }' });
  await expect(root).toHaveCSS('gap', '21px');
}

/** Render Flex from the published server entry with responsive aliases. */
function renderServerFlex(): JSX.Element {
  return createComponent(Flex, {
    id: 'server-flex',
    direction: { base: 'row', md: 'column' },
    align: 'center',
    style: { position: 'fixed' } satisfies JSX.CSSProperties,
    children: 'Server flex',
  });
}

/** Measure server responsive styles at two viewport widths. */
async function verifiesServerFlex({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerFlex);
  expect(markup).toContain('Server flex');
  expect(markup).not.toMatch(/<div[^>]*\s(?:direction|align|css)=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setViewportSize({ width: 600, height: 700 });
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const root = page.locator('#server-flex');
  await expect(root).toHaveCSS('display', 'flex');
  await expect(root).toHaveCSS('flex-direction', 'row');
  await expect(root).toHaveCSS('align-items', 'center');
  await expect(root).toHaveCSS('position', 'fixed');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(root).toHaveCSS('flex-direction', 'column');
}

test('Flex preserves aliases, layout, CSS, and native behavior', verifiesFlex);
test('published Flex renders responsive aliases on the server', verifiesServerFlex);
