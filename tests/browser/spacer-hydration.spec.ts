import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { SpacerHydrationComponents } from '../../.storybook/spacer-hydration-tree';
import { renderSpacerHydrationTree } from '../../.storybook/spacer-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as SpacerHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the browser Spacer tree to published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/spacer-hydration-example.tsx';
  const { hydrateSpacerExample } = await import(modulePath);
  const root = document.getElementById('spacer-hydration-root');
  if (!root) throw new Error('Spacer hydration root was not found.');
  hydrateSpacerExample(root);
}

/** Verify hydration preserves nodes and updates native flex styles. */
async function verifiesSpacerHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same tree through published server exports. */
    () => renderSpacerHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="spacer-hydration-root">${markup}</div>`,
  );
  const spacer = page.locator('#hydrated-spacer');
  const child = page.locator('#hydrated-spacer-child');
  await expect(spacer).toHaveCSS('flex-grow', '1');
  for (const locator of [spacer, child]) {
    await locator.evaluate(
      /** Mark server nodes before the browser runtime attaches. */
      (element) => element.setAttribute('data-server-node', 'true'),
    );
  }
  const errors: string[] = [];

  /** Collect browser errors while the component hydrates and updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#spacer-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(spacer).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-spacer-toggle').click();
  await expect(spacer).toHaveCSS('flex-grow', '2');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Spacer hydrates and updates without node replacement', verifiesSpacerHydration);
