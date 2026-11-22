import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderStrongHydrationTree,
  type StrongHydrationComponents,
} from '../../.storybook/strong-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as StrongHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the server's Strong through the published browser module. */
async function hydrateStrongInBrowser(): Promise<void> {
  const modulePath = '/.storybook/strong-hydration-example.ts';
  const { hydrateStrongExample } = await import(modulePath);
  const root = document.getElementById('strong-hydration-root');
  if (!root) throw new Error('Strong hydration root was not found.');
  hydrateStrongExample(root);
}

/** Verify published SSR keeps Strong's node, base weight, and live override. */
async function verifiesStrongHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Use published server components for the shared hydration tree. */
    () => renderStrongHydrationTree(server),
  );
  expect(markup).toContain('<strong');
  expect(markup).toContain('title="Hydrated importance"');
  expect(markup).toContain('leverui-strong');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>.strong-hydrated-plain{font-weight:400}</style><div id="strong-hydration-root">${markup}</div>`,
  );
  const strong = page.locator('#hydrated-strong');
  await expect(strong).toHaveCSS('font-weight', '600');
  await strong.evaluate(
    /** Mark the original server node before client attachment. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record uncaught browser failures during hydration. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateStrongInBrowser);
  await expect(page.locator('#strong-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(strong).toHaveAttribute('data-server-node', 'true');
  await page.locator('#strong-hydration-toggle').click();
  await expect(strong).toHaveCSS('font-weight', '400');
  expect(errors).toEqual([]);
}

test('published Strong hydrates without replacing its native element', verifiesStrongHydration);

/** Verify server-rendered Strong gets its default and override without scripts. */
async function verifiesStrongWithoutScripts({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the published server tree without attaching the browser module. */
    () => renderStrongHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const strong = page.locator('#hydrated-strong');
  await expect(strong).toHaveJSProperty('tagName', 'STRONG');
  await expect(strong).toHaveClass(/leverui-strong/);
  await expect(strong).toHaveCSS('font-weight', '600');
  await page.addStyleTag({ content: '.leverui-strong{font-weight:300}' });
  await expect(strong).toHaveCSS('font-weight', '300');
}

test('Strong default and override render from CSS without scripts', verifiesStrongWithoutScripts);
