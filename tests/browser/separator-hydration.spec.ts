import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderSeparatorHydrationTree,
  type SeparatorHydrationComponents,
} from '../../.storybook/separator-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as SeparatorHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the published Separator inside the browser test page. */
async function hydrateSeparatorInBrowser(): Promise<void> {
  const modulePath = '/.storybook/separator-hydration-example.ts';
  const { hydrateSeparatorExample } = await import(modulePath);
  const root = document.getElementById('separator-hydration-root');
  if (!root) throw new Error('Separator hydration root was not found.');
  hydrateSeparatorExample(root);
}

/** Verify server node identity, role, and styles across hydration. */
async function verifiesSeparatorHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same component tree through the published server entry. */
    () => renderSeparatorHydrationTree(server),
  );
  expect(markup).toContain('aria-orientation="horizontal"');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="separator-hydration-root">${markup}</div>`,
  );
  const separator = page.locator('#hydrated-separator');
  await expect(separator).toHaveCSS('border-top-width', '1px');
  await separator.evaluate(
    /** Mark the server node before client hydration starts. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Collect uncaught browser failures during hydration. */
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
  await page.evaluate(hydrateSeparatorInBrowser);
  await expect(page.locator('#separator-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(separator).toHaveAttribute('data-server-node', 'true');
  await page.locator('#separator-hydration-toggle').click();
  await expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  await expect(separator).toHaveCSS('border-inline-start-width', '1px');
  expect(errors).toEqual([]);
}

test('published Separator hydrates without replacing its span', verifiesSeparatorHydration);
