import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Spacer as SpacerExport } from '../../src';

type ServerExports = {
  Spacer: typeof SpacerExport;
};

const serverEntry = '../../dist/server/index.js';
const { Spacer } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Require a rendered box before checking spacer geometry. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected Spacer layout box is absent.');
  return box;
}

/** Compare layout coordinates with a tolerance for browser rounding. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Verify main-axis expansion, overrides, reactivity, and native behavior. */
async function verifiesSpacer({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-spacer--contract');
  const spacer = page.getByTestId('spacer-row-fill');
  await expect(spacer).toBeVisible({ timeout: 30_000 });
  await expect(spacer).toHaveClass(/leverui-spacer/);
  await expect(spacer).toHaveCSS('flex-grow', '1');
  await expect(spacer).toHaveCSS('justify-self', 'stretch');
  await expect(spacer).toHaveCSS('align-self', 'stretch');
  const first = await requiredBox(page.getByTestId('spacer-row-first'));
  const fill = await requiredBox(spacer);
  const last = await requiredBox(page.getByTestId('spacer-row-last'));
  expectNear(fill.width, 220);
  expectNear(last.x - first.x - first.width, fill.width);

  const columnFirst = await requiredBox(page.getByTestId('spacer-column-first'));
  const columnFill = await requiredBox(page.getByTestId('spacer-column-fill'));
  const columnLast = await requiredBox(page.getByTestId('spacer-column-last'));
  expectNear(columnFill.height, 140);
  expectNear(columnLast.y - columnFirst.y - columnFirst.height, columnFill.height);

  await expect(page.getByTestId('spacer-direct-override')).toHaveCSS('flex-grow', '2');
  await expect(page.getByTestId('spacer-style-override')).toHaveCSS('flex-grow', '3');
  await expect(page.getByTestId('spacer-unstyled')).toHaveCSS('flex-grow', '0');
  await expect(page.getByTestId('spacer-responsive')).toHaveCSS('flex-grow', '1');

  const button = page.getByRole('button', { name: 'Expand spacer' });
  const buttonChild = page.getByTestId('spacer-reactive-child');
  await expect(button).toHaveAttribute('data-ref-tag', 'button');
  await expect(button).toHaveCSS('flex-grow', '1');
  await button.evaluate(
    /** Mark the native element before a reactive style change. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await buttonChild.evaluate(
    /** Mark the native child before a reactive style change. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await button.focus();
  await expect(button).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(button).toHaveCSS('flex-grow', '2');
  await expect(button).toHaveAttribute('data-original-node', 'true');
  await expect(buttonChild).toHaveAttribute('data-original-node', 'true');
  const expanded = await requiredBox(button);
  const peer = await requiredBox(page.getByTestId('spacer-reactive-peer'));
  expect(expanded.width).toBeGreaterThan(peer.width);

  const link = page.getByRole('link', { name: 'Spacer link' });
  await expect(link).toHaveCSS('flex-grow', '1');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#spacer-target$/);
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(page.getByTestId('spacer-responsive')).toHaveCSS('flex-grow', '2');
  await page.addStyleTag({
    content: '.leverui-spacer[data-testid="spacer-row-fill"] { flex: 2; }',
  });
  await expect(spacer).toHaveCSS('flex-grow', '2');
  for (const name of ['css', 'unstyled', 'as', 'asChild']) {
    await expect(spacer).not.toHaveAttribute(name);
  }
}

/** Render the published Spacer with a native flex choice and attribute. */
function renderServerSpacer(): JSX.Element {
  return createComponent(Spacer, {
    id: 'server-spacer',
    title: 'Server space',
    flex: 2,
  });
}

/** Verify server styles and native attributes through the published entry. */
async function verifiesServerSpacer({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerSpacer);
  expect(markup).toContain('title="Server space"');
  expect(markup).toContain('leverui-spacer');
  expect(markup).not.toMatch(/<div[^>]*\s(?:css|unstyled|asChild)=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><div style="display:flex;width:180px"><span style="width:40px"></span>${markup}<span style="width:40px"></span></div>`,
  );
  const spacer = page.locator('#server-spacer');
  await expect(spacer).toHaveCSS('flex-grow', '2');
  await expect(spacer).toHaveCSS('align-self', 'stretch');
  const fill = await requiredBox(spacer);
  expectNear(fill.width, 100);
}

test('Spacer fills flex space and preserves native behavior', verifiesSpacer);
test('published Spacer renders native attributes and styles on the server', verifiesServerSpacer);
