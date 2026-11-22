import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Float as FloatExport } from '../../src';

type ServerExports = {
  Float: typeof FloatExport;
};

const serverEntry = '../../dist/server/index.js';
const { Float } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

const expectedPlacements = {
  'top-start': [-10, -10],
  'top-center': [90, -10],
  'top-end': [190, -10],
  'middle-start': [-10, 50],
  'middle-center': [90, 50],
  'middle-end': [190, 50],
  'bottom-start': [-10, 110],
  'bottom-center': [90, 110],
  'bottom-end': [190, 110],
} as const;

/** Measure a Float box relative to its positioned parent. */
async function placement(page: Page, parentId: string, childId: string) {
  const parent = await page.getByTestId(parentId).boundingBox();
  const child = await page.getByTestId(childId).boundingBox();
  if (!parent || !child) throw new Error(`Missing layout box for ${childId}.`);
  return { x: child.x - parent.x, y: child.y - parent.y };
}

/** Allow subpixel rounding in browser geometry. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Verify Float placement, offsets, logical direction, and native behavior. */
async function verifiesFloat({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-float--contract');
  const root = page.getByTestId('float-default');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveCSS('position', 'absolute');
  await expect(root).toHaveCSS('display', 'flex');
  await expect(root).toHaveCSS('align-items', 'center');
  await expect(root).toHaveCSS('justify-content', 'center');
  await expect(root).toHaveClass(/leverui-float/);
  expectNear((await placement(page, 'float-default-parent', 'float-default')).x, 190);
  expectNear((await placement(page, 'float-default-parent', 'float-default')).y, -10);

  for (const [name, [x, y]] of Object.entries(expectedPlacements)) {
    const actual = await placement(page, `float-${name}-parent`, `float-${name}`);
    expectNear(actual.x, x);
    expectNear(actual.y, y);
  }

  const shared = await placement(page, 'float-offset-parent', 'float-offset');
  const xOverride = await placement(page, 'float-x-parent', 'float-x');
  const yOverride = await placement(page, 'float-y-parent', 'float-y');
  expectNear(shared.x, 174);
  expectNear(shared.y, 6);
  expectNear(xOverride.x, 182);
  expectNear(xOverride.y, 6);
  expectNear(yOverride.x, 174);
  expectNear(yOverride.y, 2);
  await expect(page.getByTestId('float-x')).not.toHaveAttribute('offsetX');
  await expect(page.getByTestId('float-y')).not.toHaveAttribute('offsetY');
  await expect(page.getByTestId('float-offset')).not.toHaveAttribute('offset');
  await expect(page.getByTestId('float-top-start')).not.toHaveAttribute('placement');

  expectNear((await placement(page, 'float-r-parent', 'float-responsive')).x, -10);
  expectNear((await placement(page, 'float-r-parent', 'float-responsive')).y, -10);
  expectNear((await placement(page, 'float-ro-parent', 'float-responsive-offset')).x, 190);
  expectNear((await placement(page, 'float-rc-parent', 'float-responsive-combined')).x, -10);
  expectNear((await placement(page, 'float-rc-parent', 'float-responsive-combined')).y, -10);
  expectNear((await placement(page, 'float-ra-parent', 'float-responsive-array')).x, -10);
  const rtl = await placement(page, 'float-rtl-parent', 'float-rtl');
  expectNear(rtl.x, 10);
  expectNear(rtl.y, -10);
  await expect(page.getByTestId('float-css-override')).toHaveCSS('inset-block-start', '24px');
  await expect(page.getByTestId('float-unstyled')).toHaveCSS('position', 'absolute');

  const live = page.getByRole('button', { name: 'Move Float' });
  const child = page.getByTestId('float-live-child');
  await expect(live).toHaveAttribute('data-ref-tag', 'button');
  await live.evaluate(
    /** Mark the native node before its reactive placement update. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await child.evaluate(
    /** Mark the child before its parent moves. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await live.click();
  expectNear((await placement(page, 'float-live-parent', 'float-live')).x, 190);
  expectNear((await placement(page, 'float-live-parent', 'float-live')).y, 110);
  await expect(live).toHaveAttribute('data-original-node', 'true');
  await expect(child).toHaveAttribute('data-original-node', 'true');
  await live.focus();
  await expect(live).toBeFocused();
  await page.keyboard.press('Enter');
  expectNear((await placement(page, 'float-live-parent', 'float-live')).x, -10);

  const liveOffset = page.getByTestId('float-live-offset');
  const liveOffsetChild = page.getByTestId('float-live-offset-child');
  await liveOffset.evaluate(
    /** Mark the root before its reactive offset update. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await liveOffsetChild.evaluate(
    /** Mark the child before its parent offset changes. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await page.getByTestId('float-offset-toggle').click();
  expectNear((await placement(page, 'float-live-offset-parent', 'float-live-offset')).x, 174);
  await expect(liveOffset).toHaveAttribute('data-original-node', 'true');
  await expect(liveOffsetChild).toHaveAttribute('data-original-node', 'true');

  await page.setViewportSize({ width: 900, height: 700 });
  expectNear((await placement(page, 'float-r-parent', 'float-responsive')).x, 190);
  expectNear((await placement(page, 'float-r-parent', 'float-responsive')).y, 110);
  expectNear((await placement(page, 'float-ro-parent', 'float-responsive-offset')).x, 182);
  expectNear((await placement(page, 'float-rc-parent', 'float-responsive-combined')).x, 174);
  expectNear((await placement(page, 'float-rc-parent', 'float-responsive-combined')).y, 94);
  expectNear((await placement(page, 'float-ra-parent', 'float-responsive-array')).x, 190);
  expectNear((await placement(page, 'float-ra-parent', 'float-responsive-array')).y, 110);
  const link = page.getByRole('link', { name: 'Floating link' });
  await expect(link).toHaveCSS('position', 'absolute');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#float-target$/);
  await page.addStyleTag({
    content: '.leverui-float[data-testid="float-default"] { color: red; }',
  });
  await expect(root).toHaveCSS('color', 'rgb(255, 0, 0)');
  await page.addStyleTag({
    content: '.leverui-float[data-testid="float-default"] { --leverui-float-offset-x: 8px; }',
  });
  expectNear((await placement(page, 'float-default-parent', 'float-default')).x, 182);
}

/** Render a responsive Float through the published server entry. */
function renderServerFloat(): JSX.Element {
  return createComponent(Float, {
    id: 'server-float',
    style: { width: '20px', height: '20px' },
    placement: { base: 'top-start', md: 'bottom-end' } as const,
    children: 'Server float',
  });
}

/** Measure server responsive placement at two viewport widths. */
async function verifiesServerFloat({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerFloat);
  expect(markup).toContain('Server float');
  expect(markup).not.toMatch(/\s(?:placement|offset|offsetX|offsetY|css)=/);
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setViewportSize({ width: 600, height: 700 });
  await page.setContent(
    `<style>${defaultCss}</style><div id="server-float-parent" style="position:relative;width:200px;height:120px">${markup}</div>`,
  );
  const parent = page.locator('#server-float-parent');
  const child = page.locator('#server-float');
  const first = await parent.boundingBox();
  const initial = await child.boundingBox();
  if (!first || !initial) throw new Error('Server Float layout box is absent.');
  expectNear(initial.x - first.x, -10);
  expectNear(initial.y - first.y, -10);
  await page.setViewportSize({ width: 900, height: 700 });
  const second = await child.boundingBox();
  if (!second) throw new Error('Responsive server Float layout box is absent.');
  expectNear(second.x - first.x, 190);
  expectNear(second.y - first.y, 110);
}

test('Float preserves placement, offsets, native behavior, and CSS', verifiesFloat);
test('published Float renders responsive placement on the server', verifiesServerFloat);
