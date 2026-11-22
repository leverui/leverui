import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { GroupHydrationComponents } from '../../.storybook/group-hydration-tree';
import { renderGroupHydrationTree } from '../../.storybook/group-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as GroupHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser Group tree to published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/group-hydration-example.tsx';
  const { hydrateGroupExample } = await import(modulePath);
  const root = document.getElementById('group-hydration-root');
  if (!root) throw new Error('Group hydration root was not found.');
  hydrateGroupExample(root);
}

/** Verify node identity and child indexing through hydration and live updates. */
async function verifiesGroupHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server exports. */
    () => renderGroupHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="group-hydration-root">${markup}</div>`,
  );
  const group = page.locator('#hydrated-group');
  const first = page.locator('#hydrated-group-first');
  const middle = page.locator('#hydrated-group-middle');
  const last = page.locator('#hydrated-group-last');
  await expect(group).toHaveCSS('display', 'inline-flex');
  await expect(group).toHaveCSS('flex-direction', 'row');
  for (const locator of [group, first, middle, last]) {
    await locator.evaluate(
      /** Mark each server node before hydration. */
      (element) => {
        (element as HTMLElement).dataset.serverNode = 'true';
      },
    );
  }
  const errors: string[] = [];

  /** Collect runtime errors during attachment and the live update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#group-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  for (const locator of [group, first, middle, last]) {
    await expect(locator).toHaveAttribute('data-server-node', 'true');
  }
  await expect(first).toHaveCSS('--leverui-group-count', '3');
  await page.locator('#hydrated-group-toggle').click();
  await expect(group).toHaveCSS('flex-direction', 'column');
  await expect(middle).toHaveAttribute('data-leverui-group-skip', '');
  await expect(first).toHaveCSS('--leverui-group-count', '2');
  await expect(last).toHaveCSS('--leverui-group-index', '1');
  await expect(last).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Group hydrates and reindexes existing children', verifiesGroupHydration);
