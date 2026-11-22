import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import type { Center as CenterExport, CenterProps } from '../../src';

type ServerExports = {
  Center: typeof CenterExport;
};

const serverEntry = '../../dist/server/index.js';
const { Center } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Require a visible measured box for a Center geometry check. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Expected Center layout box is absent.');
  return box;
}

/** Accept subpixel browser rounding when comparing centered midpoints. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Verify centered geometry, inline variants, native behavior, and CSS overrides. */
async function verifiesCenter({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-center--contract');
  const root = page.getByTestId('center-default');
  await expect(root).toBeVisible({ timeout: 30_000 });
  await expect(root).toHaveCSS('display', 'flex');
  await expect(root).toHaveCSS('align-items', 'center');
  await expect(root).toHaveCSS('justify-content', 'center');
  const outer = await requiredBox(root);
  const inner = await requiredBox(page.getByTestId('center-default-child'));
  expectNear(inner.width, 40);
  expectNear(inner.height, 20);
  expectNear(inner.x + inner.width / 2, outer.x + outer.width / 2);
  expectNear(inner.y + inner.height / 2, outer.y + outer.height / 2);

  const inline = page.getByTestId('center-inline');
  await expect(inline).toHaveCSS('display', 'inline-flex');
  expect((await requiredBox(inline)).width).toBeLessThan(outer.width);
  await expect(inline).not.toHaveAttribute('inline');
  const responsiveObject = page.getByTestId('center-responsive-object');
  const responsiveArray = page.getByTestId('center-responsive-array');
  const conditionalOnly = page.getByTestId('center-conditional-only');
  const openBaseArray = page.getByTestId('center-open-base-array');
  await expect(responsiveObject).toHaveCSS('display', 'flex');
  await expect(responsiveArray).toHaveCSS('display', 'flex');
  await expect(conditionalOnly).toHaveCSS('display', 'flex');
  await expect(openBaseArray).toHaveCSS('display', 'flex');

  const reactive = page.getByTestId('center-reactive');
  const child = page.getByTestId('center-reactive-child');
  await expect(reactive).toHaveJSProperty('tagName', 'SECTION');
  await expect(reactive).toHaveAttribute('data-ref-tag', 'section');
  await expect(reactive).toHaveAttribute('aria-label', 'Reactive center');
  await reactive.evaluate(
    /** Mark the native root to detect replacement on an inline update. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await child.evaluate(
    /** Mark the mounted child to detect replacement on an inline update. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await page.getByTestId('center-toggle').click();
  await expect(reactive).toHaveCSS('display', 'inline-flex');
  await expect(reactive).toHaveAttribute('data-original-node', 'true');
  await expect(child).toHaveAttribute('data-original-node', 'true');

  const link = page.getByRole('link', { name: 'Centered link' });
  await expect(link).toHaveCSS('display', 'inline-flex');
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#center-target$/);
  await expect(page.getByTestId('center-unstyled')).toHaveCSS('display', 'block');
  await expect(page.getByTestId('center-custom-css')).toHaveCSS('justify-content', 'flex-end');

  await page.setViewportSize({ width: 900, height: 700 });
  await expect(responsiveObject).toHaveCSS('display', 'inline-flex');
  await expect(responsiveArray).toHaveCSS('display', 'inline-flex');
  await expect(conditionalOnly).toHaveCSS('display', 'inline-flex');
  await expect(openBaseArray).toHaveCSS('display', 'inline-flex');
  await page.addStyleTag({
    content: '.leverui-center[data-testid="center-default"] { gap: 17px; }',
  });
  await expect(root).toHaveCSS('gap', '17px');
}

/** Render responsive Center styles from the published server entry. */
function renderServerCenter(inline: NonNullable<CenterProps['inline']>): JSX.Element {
  return createComponent(Center, {
    id: 'server-center',
    style: { width: '240px', height: '100px' },
    inline,
    children: 'Server center',
  });
}

/** Render scalar and unstyled Center paths without runtime presentation props. */
function renderPlainServerCenters(): JSX.Element {
  return [
    createComponent(Center, {
      id: 'plain-server-center',
      class: 'consumer-center',
      inline: true,
      children: 'Inline center',
    }),
    createComponent(Center, {
      id: 'unstyled-server-center',
      class: 'consumer-unstyled-center',
      unstyled: true,
      children: 'Unstyled center',
    }),
    createComponent(Center, {
      id: 'responsive-server-center',
      inline: { md: true },
      children: 'Responsive center',
    }),
    createComponent(Center, {
      id: 'responsive-reset-center',
      inline: [true, false],
      children: 'Responsive reset',
    }),
  ];
}

/** Check responsive display and clean HTML from published server markup. */
async function verifiesServerCenter({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  const cases: Array<NonNullable<CenterProps['inline']>> = [{ md: true }, [null, null, true]];
  for (const inline of cases) {
    const markup = renderToString(
      /** Render each responsive shape through the published server entry. */
      () => renderServerCenter(inline),
    );
    expect(markup).toContain('Server center');
    expect(markup).not.toMatch(/<div[^>]*\sinline=/);
    await page.setViewportSize({ width: 600, height: 700 });
    await page.setContent(`<style>${defaultCss}</style>${markup}`);
    const center = page.locator('#server-center');
    await expect(center).toHaveCSS('display', 'flex');
    await expect(center).toHaveCSS('align-items', 'center');
    await page.setViewportSize({ width: 900, height: 700 });
    await expect(center).toHaveCSS('display', 'inline-flex');
  }
}

test('Center preserves flex geometry, inline variants, and native behavior', verifiesCenter);
test('published Center renders responsive inline styles on the server', verifiesServerCenter);

/** Verify scalar Center layout and consumer overrides need no component JavaScript. */
async function verifiesPlainCenterCss({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderPlainServerCenters);
  await page.setViewportSize({ width: 400, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const inline = page.locator('#plain-server-center');
  await expect(inline).toHaveAttribute('data-inline', 'true');
  await expect(inline).toHaveCSS('display', 'inline-flex');
  await expect(inline).toHaveCSS('align-items', 'center');
  await expect(inline).toHaveCSS('justify-content', 'center');
  await expect(page.locator('#unstyled-server-center')).toHaveCSS('display', 'block');
  await page.addStyleTag({ content: '.consumer-unstyled-center { display: inline-grid; }' });
  await expect(page.locator('#unstyled-server-center')).toHaveCSS('display', 'inline-grid');
  await expect(page.locator('#responsive-server-center')).toHaveCSS('display', 'flex');
  await expect(page.locator('#responsive-reset-center')).toHaveCSS('display', 'inline-flex');
  await page.setViewportSize({ width: 900, height: 700 });
  await expect(page.locator('#responsive-server-center')).toHaveCSS('display', 'inline-flex');
  await expect(page.locator('#responsive-reset-center')).toHaveCSS('display', 'flex');
  await page.addStyleTag({ content: '.consumer-center { --leverui-center-justify: flex-end; }' });
  await expect(inline).toHaveCSS('justify-content', 'flex-end');
}

test('scalar Center uses authored CSS before hydration', verifiesPlainCenterCss);
