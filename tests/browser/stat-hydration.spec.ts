import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderStatHydrationTree,
  type StatHydrationComponents,
} from '../../.storybook/stat-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as StatHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the published Stat inside a browser test page. */
async function hydrateStatInBrowser(): Promise<void> {
  const modulePath = '/.storybook/stat-hydration-example.ts';
  const { hydrateStatExample } = await import(modulePath);
  const root = document.getElementById('stat-hydration-root');
  if (!root) throw new Error('Stat hydration root was not found.');
  hydrateStatExample(root);
}

/** Verify semantic node identity and live provider styles through hydration. */
async function verifiesStatHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Use the published server entry for the first render. */
    () => renderStatHydrationTree(server),
  );
  expect(markup).toContain('id="hydrated-stat"');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="stat-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#hydrated-stat');
  const value = page.locator('#hydrated-stat-value');
  await expect(root).toHaveJSProperty('tagName', 'DL');
  await expect(value).toHaveJSProperty('tagName', 'DD');
  const initialSize = await value.evaluate(
    /** Capture the small recipe's computed font size. */
    (element) => getComputedStyle(element).fontSize,
  );
  await root.evaluate(
    /** Mark the server list before the browser attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect uncaught failures during hydration. */
  function recordPageError(error: Error): void {
    errors.push(error.message);
  }

  /** Collect warnings about mismatched server and client markup. */
  function recordConsole(message: { type(): string; text(): string }): void {
    if (
      /error|warning/.test(message.type()) &&
      /^Hydration\b|Hydration (mismatch|key miss|tag mismatch|structure mismatch)/i.test(
        message.text(),
      )
    ) {
      errors.push(message.text());
    }
  }

  page.on('pageerror', recordPageError);
  page.on('console', recordConsole);
  await page.evaluate(hydrateStatInBrowser);
  await expect(page.locator('#stat-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await page.locator('#stat-hydration-toggle').click();
  await expect(value).not.toHaveCSS('font-size', initialSize);
  expect(errors).toEqual([]);
}

test(
  'published Stat hydrates with live inherited size and stable native nodes',
  verifiesStatHydration,
);
