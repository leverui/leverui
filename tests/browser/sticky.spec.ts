import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Sticky as StickyExport } from '../../src';

type ServerExports = {
  Sticky: typeof StickyExport;
};

const serverEntry = '../../dist/server/index.js';
const { Sticky } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const consumerCss = await readFile(
  new URL('../../.storybook/sticky-consumer.css', import.meta.url),
  'utf8',
);

/** Require a rendered element box for sticky position comparisons. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected Sticky layout box is absent.');
  return box;
}

/** Compare layout positions with tolerance for browser rounding. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Verify scrolling, token offsets, overrides, and native behavior. */
async function verifiesSticky({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-sticky--contract');
  const scroll = page.getByTestId('sticky-default-scroll');
  const sticky = page.getByTestId('sticky-default');
  await expect(sticky).toBeVisible({ timeout: 30_000 });
  await expect(sticky).toHaveClass(/lui-sticky/);
  await expect(sticky).toHaveCSS('position', 'sticky');
  await expect(sticky).toHaveCSS('top', '0px');
  const scrollBox = await requiredBox(scroll);
  const initial = await requiredBox(sticky);
  expectNear(initial.y - scrollBox.y, 40);
  await scroll.evaluate(
    /** Move the element past its natural position inside the scrollport. */
    (element) => {
      element.scrollTop = 80;
    },
  );
  const pinned = await requiredBox(sticky);
  expectNear(pinned.y - scrollBox.y, 0);

  const offsetScroll = page.getByTestId('sticky-offset-scroll');
  await offsetScroll.evaluate(
    /** Scroll beyond the token-offset Sticky's natural position. */
    (element) => {
      element.scrollTop = 80;
    },
  );
  const offsetBox = await requiredBox(offsetScroll);
  const offsetSticky = page.getByTestId('sticky-offset');
  await expect(offsetSticky).toHaveCSS('top', '16px');
  expectNear((await requiredBox(offsetSticky)).y - offsetBox.y, 16);

  const responsive = page.getByTestId('sticky-responsive');
  await expect(responsive).toHaveCSS('top', '16px');
  await expect(page.getByTestId('sticky-direct-override')).toHaveCSS('position', 'relative');
  await expect(page.getByTestId('sticky-direct-override')).toHaveCSS('top', '12px');
  await expect(page.getByTestId('sticky-css-override')).toHaveCSS('top', '20px');
  await expect(page.getByTestId('sticky-unstyled')).toHaveCSS('position', 'static');

  const button = page.getByRole('button', { name: 'Shift sticky' });
  const child = page.getByTestId('sticky-reactive-child');
  await expect(button).toHaveAttribute('data-ref-tag', 'button');
  await button.evaluate(
    /** Mark the native element before a reactive offset change. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await child.evaluate(
    /** Mark the child before its parent changes style. */
    (element) => element.setAttribute('data-original-node', 'true'),
  );
  await button.click();
  await expect(button).toHaveCSS('top', '16px');
  await expect(button).toHaveAttribute('data-original-node', 'true');
  await expect(child).toHaveAttribute('data-original-node', 'true');
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveCSS('top', '0px');

  const link = page.getByRole('link', { name: 'Sticky link' });
  await expect(link).toHaveCSS('position', 'sticky');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#sticky-target$/);
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(responsive).toHaveCSS('top', '32px');
  await page.addStyleTag({
    content: '.lui-sticky[data-testid="sticky-default"] { top: 24px; }',
  });
  await expect(sticky).toHaveCSS('top', '24px');
  for (const name of ['css', 'unstyled', 'asChild']) {
    await expect(sticky).not.toHaveAttribute(name);
  }
}

/** Render a responsive Sticky through the published server entry. */
function renderServerSticky(): JSX.Element {
  return createComponent(Sticky, {
    id: 'server-sticky',
    title: 'Server sticky',
    class: 'consumer-sticky-responsive',
    children: 'Server sticky content',
  });
}

/** Verify native output and responsive offsets from the published entry. */
async function verifiesServerSticky({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerSticky);
  expect(markup).toContain('title="Server sticky"');
  expect(markup).toContain('Server sticky content');
  expect(markup).toMatch(/lui-sticky/);
  expect(markup).not.toMatch(/\s(?:css|unstyled|asChild)=/);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style><style>${consumerCss}</style>${markup}`);
  const sticky = page.locator('#server-sticky');
  await expect(sticky).toHaveCSS('position', 'sticky');
  await expect(sticky).toHaveCSS('top', '16px');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(sticky).toHaveCSS('top', '32px');
}

test('Sticky pins in a scrollport and preserves native behavior', verifiesSticky);
test('published Sticky renders responsive native styles', verifiesServerSticky);
