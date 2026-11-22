import { readFile } from 'node:fs/promises';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import { expect, test, type Page } from '@playwright/test';
import type { Command } from '../../src/components/command-exports';
import { renderCommandHydrationTree } from '../../.storybook/command-hydration-tree.mjs';

const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as {
  Command: typeof Command;
};

/** Mark a server node so replacement during hydration is visible. */
function markServerNode(element: Element): void {
  element.setAttribute('data-server-node', 'true');
}

/** Attach the published browser machine to the existing Command nodes. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/command-hydration-example.mjs';
  const { hydrateCommandExample } = await import(modulePath);
  const root = document.getElementById('command-hydration-root');
  if (!root) throw new Error('Command hydration root was not found.');
  hydrateCommandExample(root);
}

/** Check that input, option, and keyboard behavior survive client attachment. */
async function verifiesCommandHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render published Command parts with server-side Solid conditions. */
    () => renderCommandHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="command-hydration-root">${markup}</div>`,
  );
  const input = page.getByTestId('hydrated-command-input');
  const option = page.getByTestId('hydrated-command-open');
  await input.evaluate(markServerNode);
  await option.evaluate(markServerNode);
  await expect(input).toHaveClass(/leverui-command__input/);
  await expect(option).toHaveClass(/leverui-command__item/);
  const errors: string[] = [];
  /** Record client errors while Solid attaches the machine. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }
  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#command-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  expect(errors).toEqual([]);
  await expect(input).toHaveAttribute('data-server-node', 'true');
  await expect(option).toHaveAttribute('data-server-node', 'true');
  await expect(page.locator('.leverui-command__root')).toHaveAttribute('data-size', 'sm');
  await expect(page.locator('.leverui-command__root')).toHaveCSS('width', '280px');
  await input.fill('open');
  await expect(option).toBeVisible();
  await input.press('ArrowDown');
  await expect(option).toHaveAttribute('data-highlighted');
}

test('published Command nodes and keyboard search survive hydration', verifiesCommandHydration);
