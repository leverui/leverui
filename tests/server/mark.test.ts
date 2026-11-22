import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  Mark as MarkExport,
  MarkProps,
  MarkPropsProvider as PropsProviderExport,
} from '../../src';

interface ServerComponents {
  Mark: typeof MarkExport;
  MarkPropsProvider: typeof PropsProviderExport;
}

const serverEntry = '../../dist/server/index.js';
/** The built server entry must expose the source-typed Mark components. */
const server = (await import(serverEntry)) as ServerComponents;

/** Render inherited and overridden Mark elements through the published server entry. */
function renderServerMarks(): string {
  return renderToString(
    /** Supply shared context to semantic and polymorphic elements. */
    () =>
      createComponent(server.MarkPropsProvider, {
        value: {
          as: 'strong',
          variant: 'text',
          title: 'Shared emphasis',
          class: 'provided-mark',
        },
        /** Render the shared tag and two locally selected elements. */
        get children() {
          return [
            createComponent(server.Mark, {
              id: 'server-mark',
              children: 'Inherited emphasis',
            } satisfies MarkProps<'mark'>),
            createComponent(server.Mark, {
              as: 'mark',
              id: 'server-mark-native',
              children: 'Native emphasis',
            } satisfies MarkProps<'mark'>),
            createComponent(server.Mark, {
              as: 'a',
              href: '#server-mark',
              id: 'server-mark-link',
              children: 'Linked emphasis',
            } satisfies MarkProps<'a'>),
          ];
        },
      }),
  );
}

/** Verify provider defaults, semantics, and CSS variant filtering in SSR. */
function verifiesServerMark(): void {
  const markup = renderServerMarks();
  expect(markup).toMatch(/<strong[^>]*id="server-mark"/);
  expect(markup).toMatch(/<mark[^>]*id="server-mark-native"/);
  expect(markup).toMatch(/<a[^>]*id="server-mark-link"/);
  expect(markup).toContain('href="#server-mark"');
  expect(markup.match(/title="Shared emphasis"/g)).toHaveLength(3);
  expect(markup.match(/provided-mark/g)).toHaveLength(3);
  expect(markup).toContain('leverui-mark');
  expect(markup.match(/data-variant="text"/g)).toHaveLength(3);
  expect(markup).not.toContain('data-leverui-private-style-runtime');
  expect(markup).not.toMatch(/<(?:mark|strong|a)[^>]*\s(?:as|variant|recipe|unstyled)=/);
}

test('published Mark preserves native and polymorphic semantics', verifiesServerMark);
