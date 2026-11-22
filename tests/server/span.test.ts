import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Span as SpanExport, SpanProps } from '../../src';

type ServerComponents = {
  Span: typeof SpanExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render native and selected spans through the published server entry. */
function renderServerSpans(): string {
  return renderToString(
    /** Render native inline elements without a styling provider. */
    () => [
      createComponent(server.Span, {
        id: 'server-span',
        title: 'Server segment',
        style: { color: 'var(--leverui-colors-red-500)' },
        children: 'Inline server text',
      } satisfies SpanProps),
      createComponent(server.Span, {
        as: 'a',
        id: 'server-span-link',
        href: '#destination',
        children: 'Linked segment',
      } satisfies SpanProps<'a'>),
    ],
  );
}

/** Verify SSR retains native tags, attributes, and consumer styles. */
function verifiesServerSpan(): void {
  const markup = renderServerSpans();
  expect(markup).toMatch(/<span[^>]*id="server-span"/);
  expect(markup).toContain('title="Server segment"');
  expect(markup).toContain('Inline server text');
  expect(markup).toMatch(/<a[^>]*id="server-span-link"/);
  expect(markup).toContain('href="#destination"');
  expect(markup).toContain('var(--leverui-colors-red-500)');
  expect(markup).not.toMatch(/<(?:span|a)[^>]*\s(?:as|asChild|css|unstyled|role)=/);
}

test('published Span renders native inline and selected markup', verifiesServerSpan);
