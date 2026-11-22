import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderSpanHydrationTree,
  type SpanHydrationComponents,
} from '../../.storybook/span-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as SpanHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the published Span inside the browser test page. */
async function hydrateSpanInBrowser(): Promise<void> {
  const modulePath = '/.storybook/span-hydration-example.ts';
  const { hydrateSpanExample } = await import(modulePath);
  const root = document.getElementById('span-hydration-root');
  if (!root) throw new Error('Span hydration root was not found.');
  hydrateSpanExample(root);
}

/** Verify server node identity and native styles survive hydration. */
async function verifiesSpanHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the same tree through the published server entry. */
    () => renderSpanHydrationTree(server),
  );
  expect(markup).toContain('id="hydrated-span"');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><div id="span-hydration-root">${markup}</div>`,
  );
  const span = page.locator('#hydrated-span');
  await expect(span).toHaveCSS('display', 'inline');
  await expect(span).toHaveCSS('color', 'rgb(239, 68, 68)');
  await span.evaluate(
    /** Mark the server node before the browser attaches. */
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
  await page.evaluate(hydrateSpanInBrowser);
  await expect(page.locator('#span-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(span).toHaveAttribute('data-server-node', 'true');
  await page.locator('#span-hydration-toggle').click();
  await expect(span).toHaveCSS('color', 'rgb(59, 130, 246)');
  expect(errors).toEqual([]);
}

test('published Span hydrates without replacing its native element', verifiesSpanHydration);
