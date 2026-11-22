import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  Heading as HeadingExport,
  HeadingProps,
  HeadingPropsProvider as PropsProviderExport,
} from '../../src';

type ServerComponents = {
  Heading: typeof HeadingExport;
  HeadingPropsProvider: typeof PropsProviderExport;
};

const serverEntry = '../../dist/server/index.js';
/** The emitted server entry must expose the source-typed components rendered below. */
const server = (await import(serverEntry)) as ServerComponents;

/** Render native headings from the published server entry and provider scope. */
function renderServerHeadings(): string {
  return renderToString(
    /** Construct both headings under the active style system. */
    () =>
      createComponent(server.HeadingPropsProvider, {
        value: { size: '3xl' },
        /** Render a selected h1 and an instance-sized h2. */
        get children() {
          return [
            createComponent(server.Heading, {
              as: 'h1',
              id: 'server-h1',
              title: 'Server title',
              children: 'Server heading',
            } satisfies HeadingProps<'h1'>),
            createComponent(server.Heading, {
              size: 'sm',
              id: 'server-h2',
              children: 'Smaller heading',
            } satisfies HeadingProps<'h2'>),
          ];
        },
      }),
  );
}

/** Verify semantic tags, public hooks, and nonleaking recipe props in SSR. */
function verifiesServerHeading(): void {
  const markup = renderServerHeadings();
  expect(markup).toMatch(/<h1[^>]*id="server-h1"/);
  expect(markup).toMatch(/<h2[^>]*id="server-h2"/);
  expect(markup).toContain('title="Server title"');
  expect(markup).toContain('leverui-heading');
  expect(markup).toContain('Server heading');
  expect(markup).toContain('Smaller heading');
  expect(markup).not.toMatch(/<h[12][^>]*\s(?:size|recipe|unstyled)=/);
}

test('published Heading renders semantic tags without recipe attributes', verifiesServerHeading);
