import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Quote as QuoteExport, QuoteProps } from '../../src';

type ServerComponents = {
  Quote: typeof QuoteExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render native and selected quotations from the published server entry. */
function renderServerQuotes(): string {
  return renderToString(
    /** Render both semantic elements in one server request. */
    () => [
      createComponent(server.Quote, {
        id: 'server-quote',
        cite: 'https://example.com/source',
        children: 'Server quotation',
      } satisfies QuoteProps<'q'>),
      createComponent(server.Quote, {
        as: 'a',
        id: 'server-quote-link',
        href: '#source',
        children: 'Linked quotation',
      } satisfies QuoteProps<'a'>),
    ],
  );
}

/** Verify semantic tags, stable hooks, and native attributes in SSR. */
function verifiesServerQuote(): void {
  const markup = renderServerQuotes();
  expect(markup).toMatch(/<q[^>]*id="server-quote"/);
  expect(markup).toContain('cite="https://example.com/source"');
  expect(markup).toMatch(/<a[^>]*id="server-quote-link"/);
  expect(markup).toContain('href="#source"');
  expect(markup).toContain('leverui-quote');
  expect(markup).not.toMatch(/<(?:q|a)[^>]*\s(?:as|unstyled|css)=/);
}

test('published Quote renders native semantic markup and CSS hooks', verifiesServerQuote);
