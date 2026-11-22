import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { EmptyState as EmptyStateExport } from '../../src';

type ServerComponents = {
  EmptyState: typeof EmptyStateExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the compound Empty State through the published server entry. */
function renderServerEmptyState(): string {
  return renderToString(
    /** Build all parts without a styling provider. */
    () =>
      createComponent(server.EmptyState.Root, {
        id: 'server-empty-state',
        size: 'lg' as const,
        role: 'status' as const,
        /** Render content only after the root context exists. */
        get children() {
          return createComponent(server.EmptyState.Content, {
            /** Preserve the heading and paragraph tags. */
            get children() {
              return [
                createComponent(server.EmptyState.Indicator, { children: '◎' }),
                createComponent(server.EmptyState.Title, { children: 'No items' }),
                createComponent(server.EmptyState.Description, {
                  children: 'Add one to begin.',
                }),
              ];
            },
          });
        },
      }),
  );
}

/** Verify the server's native semantics and consumed variant props. */
function verifiesServerEmptyState(): void {
  const markup = renderServerEmptyState();
  expect(markup).toMatch(/<div[^>]*id="server-empty-state"/);
  expect(markup).toContain('role="status"');
  expect(markup).toContain('leverui-empty-state__indicator');
  expect(markup).toMatch(/<h3[^>]*>No items<\/h3>/);
  expect(markup).toMatch(/<p[^>]*>Add one to begin\.<\/p>/);
  expect(markup).not.toMatch(/<div[^>]*\s(?:size|recipe|css|unstyled)=/);
}

test('published Empty State renders native parts and consumes size', verifiesServerEmptyState);
