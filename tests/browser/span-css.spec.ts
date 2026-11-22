import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { createComponent } from 'solid-js';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderSpanCssHydrationTree,
  type SpanCssHydrationComponents,
} from '../../.storybook/span-css-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as SpanCssHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const consumerCss = '.span-base{color:rgb(239,68,68)}.span-alternate{color:rgb(59,130,246)}';

/** Hydrate the public browser component against its server element. */
async function hydrateSpanCssInBrowser(): Promise<void> {
  const modulePath = '/.storybook/span-css-hydration-example.ts';
  const { hydrateSpanCssExample } = await import(modulePath);
  const root = document.getElementById('span-css-hydration-root');
  if (!root) throw new Error('Span CSS hydration root was not found.');
  hydrateSpanCssExample(root);
}

/** Verify consumer CSS updates the same native Span after hydration. */
async function verifiesSpanCssHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Match the browser's reactive class tree. */
    () => renderSpanCssHydrationTree(server),
  );
  expect(markup).toContain('leverui-span');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>${consumerCss}</style><div id="span-css-hydration-root">${markup}</div>`,
  );
  const span = page.locator('#hydrated-css-span');
  await expect(span).toHaveCSS('color', 'rgb(239, 68, 68)');
  await span.evaluate(
    /** Mark the server node before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record browser errors during attachment and updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateSpanCssInBrowser);
  await expect(page.locator('#span-css-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(span).toHaveAttribute('data-server-node', 'true');
  await page.locator('#span-css-toggle').click();
  await expect(span).toHaveCSS('color', 'rgb(59, 130, 246)');
  await expect(span).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('Span consumer CSS hydrates and updates in place', verifiesSpanCssHydration);

/** Verify native Span needs no generated presentation rule before hydration. */
async function verifiesScriptFreeSpan({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the public provider and native component on the server. */
    () =>
      createComponent(server.Span, {
        id: 'script-free-span',
        class: 'consumer-inline',
        title: 'Native inline text',
        children: 'Inline text',
      }),
  );
  expect(markup).toContain('leverui-span');
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(
    `<style>${defaultCss}</style><style>.consumer-inline{font-weight:700}</style>${markup}`,
  );
  const span = page.locator('#script-free-span');
  await expect(span).toHaveJSProperty('tagName', 'SPAN');
  await expect(span).toHaveCSS('display', 'inline');
  await expect(span).toHaveCSS('font-weight', '700');
  await expect(span).toHaveAttribute('title', 'Native inline text');
}

test('Span exposes a stable native hook without scripts', verifiesScriptFreeSpan);
