import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString, type JSX } from '@solidjs/web';
import type { AspectRatio as RatioExport } from '../../src';
import type { InvalidRatioChild } from '../../.storybook/aspect-ratio-invalid-example';

type BrowserInvalidProbe = {
  invalidAspectRatioMessage: (kind: InvalidRatioChild) => string;
};

type ServerExports = {
  AspectRatio: typeof RatioExport;
};

const serverEntry = '../../dist/server/index.js';
const { AspectRatio } = (await import(serverEntry)) as ServerExports;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Read a visible element's actual CSS layout box. */
async function requiredBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('The expected aspect-ratio box is absent.');
  return box;
}

/** Compare a layout dimension within subpixel browser rounding. */
function expectNear(actual: number, expected: number): void {
  expect(Math.abs(actual - expected)).toBeLessThan(1.5);
}

/** Require a media child to occupy its parent's entire ratio box. */
async function expectFillsParent(parent: Locator, child: Locator): Promise<void> {
  const outer = await requiredBox(parent);
  const inner = await requiredBox(child);
  expectNear(inner.x, outer.x);
  expectNear(inner.y, outer.y);
  expectNear(inner.width, outer.width);
  expectNear(inner.height, outer.height);
}

/** Verify native media, responsive values, tokens, reactivity, and CSS overrides. */
async function verifiesAspectRatio({ page }: { page: Page }): Promise<void> {
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=layout-aspect-ratio--contract');
  const defaultRoot = page.getByTestId('default-ratio');
  await expect(defaultRoot).toBeVisible({ timeout: 30_000 });
  expectNear((await requiredBox(defaultRoot)).height, 180);
  await expectFillsParent(defaultRoot, page.getByTestId('default-content'));
  expectNear((await requiredBox(page.getByTestId('image-ratio'))).height, 135);
  await expectFillsParent(page.getByTestId('image-ratio'), page.getByTestId('ratio-image'));
  await expect(page.getByRole('img', { name: 'Ratio illustration' })).toHaveCSS(
    'object-fit',
    'cover',
  );
  expectNear((await requiredBox(page.getByTestId('video-ratio'))).height, (160 * 16) / 9);
  await expectFillsParent(page.getByTestId('video-ratio'), page.getByTestId('ratio-video'));
  await expect(page.getByTestId('ratio-video')).toHaveCSS('object-fit', 'cover');
  await expect(page.getByTitle('Ratio map')).toHaveCount(1);
  const childLink = page.getByTestId('child-ratio');
  await expect(childLink).toHaveJSProperty('tagName', 'A');
  await expect(childLink).toHaveAttribute('href', '#ratio-target');
  expectNear((await requiredBox(childLink)).height, 180);
  await expectFillsParent(childLink, page.getByTestId('child-ratio-content'));
  expectNear((await requiredBox(page.getByTestId('map-ratio'))).height, 240);
  expectNear((await requiredBox(page.getByTestId('array-ratio'))).height, 240);
  await expectFillsParent(page.getByTestId('map-ratio'), page.getByTestId('ratio-map'));

  const reactive = page.getByTestId('reactive-ratio');
  const child = page.getByTestId('reactive-child');
  await expect(reactive).toHaveJSProperty('tagName', 'SECTION');
  await expect(reactive).toHaveAttribute('data-ref-tag', 'section');
  await expect(reactive).toHaveAttribute('aria-label', 'Reactive ratio');
  await expect(reactive).not.toHaveAttribute('ratio');
  expectNear((await requiredBox(reactive)).height, 200);
  await child.evaluate(
    /** Tag the child to verify its identity across a live ratio change. */
    (element) => {
      (element as HTMLElement).dataset.originalNode = 'true';
    },
  );
  await page.getByTestId('ratio-toggle').click();
  expectNear((await requiredBox(reactive)).height, 100);
  await expect(child).toHaveAttribute('data-original-node', 'true');
  await expectFillsParent(reactive, child);
  await child.focus();
  await expect(child).toBeFocused();

  await page.setViewportSize({ width: 900, height: 700 });
  expectNear((await requiredBox(page.getByTestId('map-ratio'))).height, 135);
  expectNear((await requiredBox(page.getByTestId('array-ratio'))).height, 135);
  await page.addStyleTag({
    content: '.leverui-aspect-ratio[data-testid="reactive-ratio"]::before { padding-bottom: 75%; }',
  });
  expectNear((await requiredBox(reactive)).height, 150);
}

/** Render the default ratio using the published server entry. */
function renderServerRatio(): JSX.Element {
  return createComponent(AspectRatio, {
    id: 'server-ratio',
    style: { width: '240px' },
    ratio: { base: 1, md: 16 / 9 },
    /** Render the native child without a style sibling. */
    get children() {
      return createComponent(Dynamic, {
        component: 'div',
        id: 'server-ratio-child',
        children: 'Server content',
      });
    },
  });
}

/** Verify published markup and responsive spacer rules in Chromium. */
async function verifiesServerRatio({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(renderServerRatio);
  expect(markup).toContain('Server content');
  expect(markup).not.toMatch(/<div[^>]*\sratio=/);
  await page.setViewportSize({ width: 600, height: 700 });
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const root = page.locator('#server-ratio');
  expectNear((await requiredBox(root)).height, 240);
  await expectFillsParent(root, page.locator('#server-ratio-child'));
  await page.setViewportSize({ width: 900, height: 700 });
  expectNear((await requiredBox(root)).height, 135);
}

/** Render an invalid child through the published server entry. */
function renderInvalidServerRatio(kind: InvalidRatioChild): string {
  return renderToString(
    /** Build the same native boundary as valid server examples. */
    () =>
      createComponent(AspectRatio, {
        /** Supply an absent, text, or multiple-element child. */
        get children() {
          if (kind === 'none') return null;
          if (kind === 'text') return 'text';
          return [
            createComponent(Dynamic, { component: 'div' }),
            createComponent(Dynamic, { component: 'span' }),
          ];
        },
      }),
  );
}

/** Require the published server component to reject invalid content. */
function verifiesInvalidServerChildren(): void {
  for (const kind of ['none', 'text', 'multiple'] as const) {
    expect(
      /** Render each invalid child under a fresh server owner. */
      () => renderInvalidServerRatio(kind),
    ).toThrow('AspectRatio requires exactly one element child.');
  }
}

/** Reject ratios that cannot describe a finite width-to-height box. */
function verifiesInvalidServerRatios(): void {
  for (const ratio of [0, -1, Infinity, NaN, { md: Infinity }]) {
    expect(
      /** Render each invalid ratio through the published server entry. */
      () =>
        renderToString(
          /** Supply one valid child so the ratio is the only failure. */
          () =>
            createComponent(AspectRatio, {
              ratio,
              children: createComponent(Dynamic, { component: 'div' }),
            }),
        ),
    ).toThrow('AspectRatio ratio requires positive finite numbers at ordinary breakpoints.');
  }
}

/** Require the browser component to reject invalid content. */
async function verifiesInvalidBrowserChildren({ page }: { page: Page }): Promise<void> {
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  const messages = await page.evaluate(
    /** Load the client probe through Storybook's served modules. */
    async () => {
      const modulePath = '/.storybook/aspect-ratio-invalid-example.tsx';
      const { invalidAspectRatioMessage } = (await import(modulePath)) as BrowserInvalidProbe;
      return (['none', 'text', 'multiple'] as const).map(invalidAspectRatioMessage);
    },
  );
  expect(messages).toEqual(Array(3).fill('AspectRatio requires exactly one element child.'));
}

test(
  'AspectRatio preserves media layout, responsive ratios, and reactive styles',
  verifiesAspectRatio,
);
test('published AspectRatio renders responsive layout on the server', verifiesServerRatio);
test('published AspectRatio rejects invalid server children', verifiesInvalidServerChildren);
test('published AspectRatio rejects invalid numeric ratios', verifiesInvalidServerRatios);
test('AspectRatio rejects invalid browser children', verifiesInvalidBrowserChildren);
