import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { AbsoluteCenter as CenterExport } from '../../src';

type ServerExports = {
  AbsoluteCenter: typeof CenterExport;
};

type Axis = 'horizontal' | 'vertical' | 'both';

const serverEntry = '../../dist/server/index.js';
const { AbsoluteCenter } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Render one centered child through the published server entry. */
function renderCenter(axis: Axis, id: string, unstyled = false): string {
  /** Render one selected axis without a presentation provider. */
  function renderTree(): JSX.Element {
    return createComponent(AbsoluteCenter, {
      id,
      axis,
      unstyled,
      children: axis,
    });
  }

  return renderToString(renderTree);
}

/** Compare the child's midpoint with the positioned parent's midpoint. */
async function centerOffset(page: Page, id: string, axis: 'x' | 'y'): Promise<number> {
  const parent = await page.locator(`#${id}-frame`).boundingBox();
  const child = await page.locator(`#${id}`).boundingBox();
  if (!parent || !child) throw new Error(`Missing layout box for ${id}.`);
  return axis === 'x'
    ? child.x + child.width / 2 - parent.x - parent.width / 2
    : child.y + child.height / 2 - parent.y - parent.height / 2;
}

/** Verify authored axes, RTL, and consumer CSS before any hydration. */
async function verifiesAuthoredAbsoluteCenter({ page }: { page: Page }): Promise<void> {
  const cases = [
    { id: 'both', axis: 'both', dir: 'ltr' },
    { id: 'horizontal', axis: 'horizontal', dir: 'ltr' },
    { id: 'vertical', axis: 'vertical', dir: 'ltr' },
    { id: 'rtl-both', axis: 'both', dir: 'rtl' },
    { id: 'rtl-horizontal', axis: 'horizontal', dir: 'rtl' },
  ] as const;
  const frames = cases
    .map(
      /** Give each axis its own positioned containing block. */
      ({ id, axis, dir }) =>
        `<div class="frame" id="${id}-frame" dir="${dir}">${renderCenter(axis, id)}</div>`,
    )
    .join('');
  const nestedLtr = `<div dir="rtl"><div class="frame" id="nested-ltr-frame" dir="ltr">${renderCenter('horizontal', 'nested-ltr')}</div></div>`;
  const markup = `${frames}${nestedLtr}<div class="frame" id="unstyled-frame">${renderCenter('both', 'unstyled', true)}</div>`;
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}.frame{position:relative;width:200px;height:100px}.lui-absolute-center{width:40px;height:20px}</style>${markup}`,
  );
  for (const id of ['both', 'horizontal', 'rtl-both', 'rtl-horizontal', 'nested-ltr']) {
    expect(Math.abs(await centerOffset(page, id, 'x'))).toBeLessThan(1.5);
  }
  for (const id of ['both', 'vertical', 'rtl-both']) {
    expect(Math.abs(await centerOffset(page, id, 'y'))).toBeLessThan(1.5);
  }
  await expect(page.locator('#rtl-horizontal')).toHaveCSS('translate', '50%');
  await expect(page.locator('#rtl-both')).toHaveCSS('translate', '50% -50%');
  await expect(page.locator('#nested-ltr')).toHaveCSS('translate', '-50%');
  await expect(page.locator('#unstyled')).toHaveCSS('position', 'static');
  await page.addStyleTag({ content: '#both { top: 10px; }' });
  await expect(page.locator('#both')).toHaveCSS('top', '10px');
}

test(
  'AbsoluteCenter axes and RTL use authored CSS before hydration',
  verifiesAuthoredAbsoluteCenter,
);
