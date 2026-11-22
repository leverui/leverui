import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { ContainerHydrationComponents } from '../../.storybook/container-hydration-tree';
import { renderContainerHydrationTree } from '../../.storybook/container-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ContainerHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser Container behavior to published server markup. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/container-hydration-example.tsx';
  const { hydrateContainerExample } = await import(modulePath);
  const root = document.getElementById('container-hydration-root');
  if (!root) throw new Error('Container hydration root was not found.');
  hydrateContainerExample(root);
}

/** Verify server nodes survive hydration and a responsive recipe update. */
async function verifiesContainerHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Use one tree through the published server components. */
    () => renderContainerHydrationTree(server),
  );
  await page.setViewportSize({ width: 1700, height: 800 });
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="container-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#hydrated-container');
  const child = page.locator('#hydrated-container-child');
  await expect(root).toHaveCSS('max-width', '1440px');
  await root.evaluate(
    /** Mark the server root before attaching Solid behavior. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  await child.evaluate(
    /** Mark the server child before attaching Solid behavior. */
    (element) => {
      (element as HTMLElement).dataset.serverNode = 'true';
    },
  );
  const errors: string[] = [];

  /** Record runtime errors during attachment and a live variant change. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#container-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  await page.locator('#hydrated-container-toggle').click();
  await expect(root).toHaveCSS('max-width', '100%');
  await expect(child).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Container hydrates without replacing nodes', verifiesContainerHydration);
