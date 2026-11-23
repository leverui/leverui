import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import type { StackHydrationComponents } from '../../.storybook/stack-hydration-tree';
import { renderStackHydrationTree } from '../../.storybook/stack-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as StackHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach browser Stack behavior through the Storybook module server. */
async function hydrateInBrowser(): Promise<void> {
  const modulePath = '/.storybook/stack-hydration-example.tsx';
  const { hydrateStackExample } = await import(modulePath);
  const root = document.getElementById('stack-hydration-root');
  if (!root) throw new Error('Stack hydration root was not found.');
  hydrateStackExample(root);
}

/** Verify Stack and its separator retain native server nodes after updates. */
async function verifiesStackHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderStackHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="stack-hydration-root">${markup}</div>`,
  );
  const stack = page.locator('#hydrated-stack');
  const first = page.locator('#hydrated-stack-first');
  const second = page.locator('#hydrated-stack-second');
  const line = stack.locator('.lui-stack-separator');
  await expect(stack).toHaveCSS('flex-direction', 'column');
  await expect(line).toHaveCSS('border-top-width', '1px');
  for (const locator of [stack, first, second, line]) {
    await locator.evaluate(
      /** Mark each server element before hydration can attach. */
      (element) => {
        (element as HTMLElement).dataset.serverNode = 'true';
      },
    );
  }
  await line.evaluate(
    /** Retain a direct reference to distinguish node replacement from attribute cleanup. */
    (element) => {
      (window as Window & { originalStackLine?: Element }).originalStackLine = element;
    },
  );
  const errors: string[] = [];

  /** Collect browser errors from attachment and live updates. */
  function recordError(error: Error): void {
    errors.push(error.message);
  }

  page.on('pageerror', recordError);
  await page.evaluate(hydrateInBrowser);
  await expect(page.locator('#stack-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  for (const locator of [stack, first, second, line]) {
    await expect(locator).toHaveAttribute('data-server-node', 'true');
  }
  await page.locator('#hydrated-stack-toggle').click();
  await expect(stack).toHaveCSS('flex-direction', 'row');
  await expect(line).toHaveCSS('margin-left', '16px');
  await expect(line).toHaveCSS('border-inline-start-width', '1px');
  expect(
    await line.evaluate(
      /** Compare the current separator with its original server node. */
      (element) =>
        (window as Window & { originalStackLine?: Element }).originalStackLine === element,
    ),
  ).toBe(true);
  for (const locator of [stack, first, second, line]) {
    await expect(locator).toHaveAttribute('data-server-node', 'true');
  }
  expect(errors).toEqual([]);
}

test(
  'published Stack hydrates separators and changes axis without replacement',
  verifiesStackHydration,
);
