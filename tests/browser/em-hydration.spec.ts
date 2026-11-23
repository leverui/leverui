import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderEmHydrationTree,
  type EmHydrationComponents,
} from '../../.storybook/em-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as EmHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the server's Em through the emitted browser module. */
async function hydrateEmInBrowser(): Promise<void> {
  const modulePath = '/.storybook/em-hydration-example.ts';
  const { hydrateEmExample } = await import(modulePath);
  const root = document.getElementById('em-hydration-root');
  if (!root) throw new Error('Em hydration root was not found.');
  hydrateEmExample(root);
}

/** Verify published SSR, native styling, preserved identity, and live hydration. */
async function verifiesEmHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through published server components. */
    () => renderEmHydrationTree(server),
  );
  expect(markup).toContain('<em');
  expect(markup).toContain('title="Hydrated emphasis"');
  expect(markup).toContain('lui-em');
  expect(markup).not.toContain('fontStyle=');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>.lui-em{font-style:oblique}.em-hydrated-plain{font-style:normal}</style><div id="em-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#em-hydration-root');
  const emphasized = page.locator('#hydrated-em');
  await expect(emphasized).toHaveCSS('font-style', 'oblique');
  await emphasized.evaluate(
    /** Mark the exact server node before Solid attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record browser errors while hydrating and changing consumer classes. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateEmInBrowser);
  await expect(root).toHaveAttribute('data-hydrated', 'true');
  await expect(emphasized).toHaveAttribute('data-server-node', 'true');
  await expect(emphasized).toHaveCSS('font-style', 'oblique');
  await page.locator('#em-hydration-toggle').click();
  await expect(emphasized).toHaveCSS('font-style', 'normal');
  expect(errors).toEqual([]);
}

test('published Em hydrates without replacing native emphasis', verifiesEmHydration);

/** Verify the default italic and consumer override from script-free HTML. */
async function verifiesEmWithoutScripts({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same published server tree without browser attachment. */
    () => renderEmHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-browser-smoke--ready');
  await page.setContent(`<style>${defaultCss}</style>${markup}`);
  const emphasized = page.locator('#hydrated-em');
  await expect(emphasized).toHaveJSProperty('tagName', 'EM');
  await expect(emphasized).toHaveClass(/lui-em/);
  await expect(emphasized).toHaveCSS('font-style', 'italic');
  await page.addStyleTag({ content: '.lui-em{font-style:oblique}' });
  await expect(emphasized).toHaveCSS('font-style', 'oblique');
}

test('Em default and override render from CSS without scripts', verifiesEmWithoutScripts);
