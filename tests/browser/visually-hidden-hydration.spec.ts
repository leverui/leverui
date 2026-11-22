import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { VisuallyHiddenHydrationComponents } from '../../.storybook/visually-hidden-hydration-tree';
import { renderVisuallyHiddenHydrationTree } from '../../.storybook/visually-hidden-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as VisuallyHiddenHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser tree to server-rendered hidden text and input. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/visually-hidden-hydration-example.tsx';
  const { hydrateVisuallyHiddenExample } = await import(modulePath);
  const root = document.getElementById('visually-hidden-hydration-root');
  if (!root) throw new Error('Visually Hidden hydration root was not found.');
  hydrateVisuallyHiddenExample(root);
}

/** Verify native nodes, hidden styles, and text survive hydration updates. */
async function verifiesVisuallyHiddenHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the installed server entry. */
    () => renderVisuallyHiddenHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>.hydrated-hidden-wide{width:2px}</style><div id="visually-hidden-hydration-root">${markup}</div>`,
  );
  const text = page.locator('#hydrated-hidden-text');
  const input = page.locator('#hydrated-hidden-input');
  await expect(text).toHaveCSS('width', '1px');
  await expect(input).toHaveCSS('width', '1px');
  await text.evaluate(
    /** Tag the server span to detect replacement during hydration. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  await input.evaluate(
    /** Tag the server input to detect replacement during hydration. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  const errors: string[] = [];

  /** Record errors raised while the client attaches and updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#visually-hidden-hydration-root')).toHaveAttribute(
    'data-hydrated',
    'true',
  );
  await expect(text).toHaveAttribute('data-server-node', 'true');
  await expect(input).toHaveAttribute('data-server-node', 'true');
  await expect(text).toHaveCSS('width', '1px');
  await expect(input).toHaveCSS('width', '1px');
  await page.locator('#hidden-toggle').click();
  await expect(text).toHaveText('Updated hidden text');
  await expect(text).toHaveCSS('width', '2px');
  await expect(text).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test(
  'published VisuallyHidden hydrates span and child input without replacement',
  verifiesVisuallyHiddenHydration,
);
