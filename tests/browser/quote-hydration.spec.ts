import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import {
  renderQuoteHydrationTree,
  type QuoteHydrationComponents,
} from '../../.storybook/quote-hydration-tree';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as QuoteHydrationComponents;
const defaultCss = await readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');

/** Hydrate the server quotation through the published browser module. */
async function hydrateQuoteInBrowser(): Promise<void> {
  const modulePath = '/.storybook/quote-hydration-example.ts';
  const { hydrateQuoteExample } = await import(modulePath);
  const root = document.getElementById('quote-hydration-root');
  if (!root) throw new Error('Quote hydration root was not found.');
  hydrateQuoteExample(root);
}

/** Verify native quotation identity and live styles across hydration. */
async function verifiesQuoteHydration({ page }: { page: Page }): Promise<void> {
  const markup = renderToString(
    /** Render the shared tree through the published server entry. */
    () => renderQuoteHydrationTree(server),
  );
  expect(markup).toContain('<q');
  expect(markup).toContain('cite="https://example.com/hydrated"');
  expect(markup).toContain('leverui-quote');
  await page.goto('/iframe.html?id=setup-hydration-host--ready');
  await page.setContent(
    `${generateHydrationScript()}<style>${defaultCss}</style><style>.plain-quote{font-weight:400}</style><div id="quote-hydration-root">${markup}</div>`,
  );
  const quote = page.locator('#hydrated-quote');
  await expect(quote).toHaveJSProperty('tagName', 'Q');
  await expect(quote).toHaveCSS('font-weight', '700');
  await quote.evaluate(
    /** Mark the server element before client hydration starts. */
    (element) => element.setAttribute('data-server-node', 'true'),
  );
  const errors: string[] = [];

  /** Record uncaught browser errors during hydration. */
  function recordPageError(error: Error): void {
    errors.push(error.message);
  }

  /** Record browser warnings about hydration or mismatched markup. */
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
  await page.evaluate(hydrateQuoteInBrowser);
  await expect(page.locator('#quote-hydration-root')).toHaveAttribute('data-hydrated', 'true');
  await expect(quote).toHaveAttribute('data-server-node', 'true');
  await expect(quote).toHaveCSS('font-weight', '700');
  await page.locator('#quote-hydration-toggle').click();
  await expect(quote).toHaveClass(/plain-quote/);
  await expect(quote).toHaveCSS('font-weight', '400');
  expect(errors).toEqual([]);
}

test('published Quote hydrates without replacing its native q', verifiesQuoteHydration);
