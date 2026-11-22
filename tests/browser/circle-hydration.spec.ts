import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { CircleHydrationComponents } from '../../.storybook/circle-hydration-tree';
import { renderCircleHydrationTree } from '../../.storybook/circle-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as CircleHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser Circle behavior to published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/circle-hydration-example.tsx';
  const { hydrateCircleExample } = await import(modulePath);
  const root = document.getElementById('circle-hydration-root');
  if (!root) throw new Error('Circle hydration root was not found.');
  hydrateCircleExample(root);
}

/** Verify hydrated node reuse, circular styles, and live sizing. */
async function verifiesCircleHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderCircleHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="circle-hydration-root">${markup}</div>`,
  );
  const circle = page.locator('#hydrated-circle');
  const child = page.locator('#hydrated-circle-child');
  await expect(circle).toHaveCSS('width', '32px');
  await expect(circle).toHaveCSS('border-radius', '9999px');
  await circle.evaluate(
    /** Mark the server root to detect replacement. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  await child.evaluate(
    /** Mark the server child to detect replacement. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  const errors: string[] = [];

  /** Collect errors from attachment and the live size update. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#circle-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(circle).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-circle-toggle').click();
  await expect(circle).toHaveCSS('width', '48px');
  await expect(circle).toHaveCSS('height', '48px');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Circle hydrates and changes size without replacing nodes', verifiesCircleHydration);
