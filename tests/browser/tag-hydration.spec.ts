import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderTagHydrationTree,
  type TagHydrationComponents,
} from '../../.storybook/tag-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as TagHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate published Tag parts through their browser module. */
async function hydrateTagInBrowser(): Promise<void> {
  const modulePath = '/.storybook/tag-hydration-example.ts';
  const { hydrateTagExample } = await import(modulePath);
  const root = document.getElementById('tag-hydration-root');
  if (!root) throw new Error('Tag hydration root was not found.');
  hydrateTagExample(root);
}

/** Verify server nodes, live size, and close action survive hydration. */
async function verifiesTagHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderTagHydrationTree(server),
  );
  expect(markup).toContain('lui-tag__label');
  expect(markup).toContain('aria-label="Close"');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="tag-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#hydrated-tag');
  const close = page.locator('#hydrated-tag-close');
  await expect(root).toHaveCSS('padding-left', '6px');
  await close.evaluate(
    /** Mark the original button before client attachment. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Capture browser errors during attachment and updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateTagInBrowser);
  await expect(page.locator('#tag-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(close).toHaveAttribute('data-server-node', 'true');
  await page.locator('#tag-hydration-toggle').click();
  await expect(root).toHaveCSS('padding-left', '10px');
  await close.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#tag-hydration-closes')).toHaveText('1');
  expect(errors).toEqual([]);
}

test('published Tag hydrates size and close behavior on native nodes', verifiesTagHydration);
