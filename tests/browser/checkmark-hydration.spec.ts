import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderCheckmarkHydrationTree,
  type CheckmarkHydrationComponents,
} from '../../.storybook/checkmark-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as CheckmarkHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Attach the published browser Checkmark to its current server-rendered host. */
async function hydrateCheckmarkInBrowser(): Promise<void> {
  const modulePath = '/.storybook/checkmark-hydration-example.ts';
  const { hydrateCheckmarkExample } = await import(modulePath);
  const root = document.getElementById('checkmark-hydration-root');
  if (!root) throw new Error('Checkmark hydration root was not found.');
  hydrateCheckmarkExample(root);
}

/** Verify SVG and style reuse while glyph and disabled state change after hydration. */
async function verifiesCheckmarkHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the published server tree before client attachment. */
    () => renderCheckmarkHydrationTree(server),
  );
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="checkmark-hydration-root">${markup}</div>`,
  );
  const root = page.locator('#hydrated-checkmark');
  await expect(root).toHaveAttribute('data-state', 'checked');
  await expect(root.locator('polyline')).toHaveAttribute('points', '20 6 9 17 4 12');
  await root.evaluate(
    /** Mark the server SVG before the browser client attaches. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Capture uncaught client hydration errors. */
  function recordPageError(error: Error): void {
    errors.push(error.message);
  }

  /** Capture hydration mismatch warnings from the browser console. */
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
  await page.evaluate(hydrateCheckmarkInBrowser);
  await expect(page.locator('#checkmark-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  await page.locator('#checkmark-hydration-cycle').click();
  await expect(root).toHaveAttribute('data-state', 'indeterminate');
  await expect(root.locator('path')).toHaveAttribute('d', 'M5 12h14');
  await page.locator('#checkmark-hydration-cycle').click();
  await expect(root).toHaveAttribute('data-state', 'unchecked');
  await expect(root.locator('path, polyline')).toHaveCount(0);
  await page.locator('#checkmark-hydration-disabled').click();
  await expect(root).toHaveAttribute('data-disabled', '');
  await expect(root).toHaveCSS('opacity', '0.5');
  await expect(root).toHaveAttribute('data-server-node', 'true');
  expect(errors).toEqual([]);
}

test('published Checkmark hydrates its SVG and reactive glyph states', verifiesCheckmarkHydration);
