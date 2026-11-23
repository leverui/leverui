import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { Dynamic, generateHydrationScript, renderToString, type JSX } from '@solidjs/web';
import {
  renderTextCssHydrationTree,
  type TextCssHydrationComponents,
} from '../../.storybook/text-css-hydration-tree';
import type { TextProps } from '../../src';
import type { TextPropsProvider as DefaultsExport } from '../../src';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as TextCssHydrationComponents & {
  TextPropsProvider: typeof DefaultsExport;
};
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

type ChildProps = Parameters<NonNullable<TextProps['asChild']>>[0];

/** Render a caller-owned link with the Text component's native attributes. */
function renderLink(getProps: ChildProps): JSX.Element {
  return createComponent(Dynamic, {
    component: 'a',
    ...getProps(),
    href: '#text-target',
    children: 'Child link',
  });
}

/** Render plain and clipped Text variants through the published server entry. */
function renderTextExamples(): string {
  return renderToString(
    /** Keep all specimens under the public provider. */
    () => [
      createComponent(server.Text, {
        as: 'article',
        id: 'plain-text',
        class: 'consumer-text',
        children: 'Plain text',
      } satisfies TextProps<'article'>),
      createComponent(server.Text, {
        id: 'truncated-text',
        truncate: true,
        children: 'A sentence that can truncate',
      } satisfies TextProps<'p'>),
      createComponent(server.Text, {
        id: 'clamped-text',
        lineClamp: '2',
        style: { color: 'rgb(255, 0, 0)' },
        children: 'A paragraph that can be clamped to two lines',
      } satisfies TextProps<'p'>),
      createComponent(server.Text, {
        id: 'unclamped-text',
        lineClamp: 'none',
        children: 'No clamp',
      } satisfies TextProps<'p'>),
      createComponent(server.Text, {
        id: 'string-style-clamp',
        lineClamp: 3,
        style: 'color: rgb(0, 0, 255)',
        children: 'String style and line clamp',
      } satisfies TextProps<'p'>),
      createComponent(server.Text, {
        id: 'unstyled-truncate',
        unstyled: true,
        truncate: true,
        children: 'Explicit clipping remains effective',
      } satisfies TextProps<'p'>),
      createComponent(server.Text, {
        id: 'child-text',
        asChild: renderLink,
        truncate: true,
      } satisfies TextProps<'p'>),
      createComponent(server.TextPropsProvider, {
        value: { truncate: true },
        /** Inherited clipping yields to an explicit false instance prop. */
        get children() {
          return [
            createComponent(server.Text, {
              id: 'inherited-truncate',
              children: 'Inherited clipping',
            }),
            createComponent(server.Text, {
              id: 'overridden-truncate',
              truncate: false,
              children: 'Explicit override',
            } satisfies TextProps<'p'>),
          ];
        },
      }),
    ],
  );
}

/** Verify script-free clipping, native semantics, and consumer overrides. */
async function verifiesTextCss({ page }: { page: Page }): Promise<void> {
  const markup = renderTextExamples();
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>.consumer-text{font-size:19px}</style>${markup}`,
  );
  const plain = page.locator('#plain-text');
  await expect(plain).toHaveJSProperty('tagName', 'ARTICLE');
  await expect(plain).toHaveClass(/lui-text/);
  await expect(plain).toHaveCSS('font-size', '19px');
  await expect(plain).not.toHaveAttribute('style');
  const truncated = page.locator('#truncated-text');
  await expect(truncated).toHaveCSS('text-overflow', 'ellipsis');
  await expect(truncated).toHaveCSS('white-space', 'nowrap');
  const clamped = page.locator('#clamped-text');
  await expect(clamped).toHaveCSS('-webkit-line-clamp', '2');
  await expect(clamped).toHaveCSS('color', 'rgb(255, 0, 0)');
  await expect(page.locator('#unclamped-text')).not.toHaveCSS('-webkit-line-clamp', '2');
  const stringStyle = page.locator('#string-style-clamp');
  await expect(stringStyle).toHaveCSS('-webkit-line-clamp', '3');
  await expect(stringStyle).toHaveCSS('color', 'rgb(0, 0, 255)');
  await expect(page.locator('#unstyled-truncate')).toHaveCSS('text-overflow', 'ellipsis');
  const link = page.locator('#child-text');
  await expect(link).toHaveJSProperty('tagName', 'A');
  await expect(link).toHaveAttribute('href', '#text-target');
  await expect(link).toHaveCSS('text-overflow', 'ellipsis');
  await expect(page.locator('#inherited-truncate')).toHaveCSS('text-overflow', 'ellipsis');
  await expect(page.locator('#overridden-truncate')).not.toHaveCSS('text-overflow', 'ellipsis');
}

/** Attach the published browser Text tree to its server markup. */
async function hydrateTextCssInBrowser(): Promise<void> {
  const modulePath = '/.storybook/text-css-hydration-example.ts';
  const { hydrateTextCssExample } = await import(modulePath);
  const root = document.getElementById('text-css-hydration-root');
  if (!root) throw new Error('Text CSS hydration root was not found.');
  hydrateTextCssExample(root);
}

/** Verify clipping attributes update on the same hydrated native elements. */
async function verifiesTextCssHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Match the browser's reactive Text tree exactly. */
    () => renderTextCssHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="text-css-hydration-root">${markup}</div>`,
  );
  const truncated = page.locator('#hydrated-css-truncate');
  const clamped = page.locator('#hydrated-css-clamp');
  await expect(truncated).toHaveCSS('text-overflow', 'ellipsis');
  await expect(clamped).toHaveCSS('-webkit-line-clamp', '2');
  await truncated.evaluate(
    /** Mark the server element before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];
  /** Capture browser errors during attachment and reactive updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateTextCssInBrowser);
  await expect(page.locator('#text-css-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(truncated).toHaveAttribute('data-server-node', 'true');
  await page.locator('#text-css-hydration-toggle').click();
  await expect(truncated).not.toHaveAttribute('data-truncate');
  await expect(truncated).toHaveCSS('font-weight', '700');
  await expect(clamped).toHaveAttribute('data-line-clamp', 'none');
  await expect(clamped).not.toHaveCSS('-webkit-line-clamp', '2');
  await expect(clamped).not.toHaveAttribute('style');
  await expect(truncated).toHaveAttribute('data-server-node', 'true');
  await page.locator('#text-css-hydration-toggle').click();
  await expect(truncated).toHaveAttribute('data-truncate', '');
  await expect(truncated).toHaveCSS('font-weight', '400');
  await expect(truncated).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('Text clipping and overrides render from CSS without scripts', verifiesTextCss);
test('published Text clipping hydrates in place', verifiesTextCssHydration);
