import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  Highlight as HighlightExport,
  MarkPropsProvider as MarkPropsProviderExport,
} from '../../src';

interface ServerComponents {
  Highlight: typeof HighlightExport;
  MarkPropsProvider: typeof MarkPropsProviderExport;
}

const serverEntry = '../../dist/server/index.js';
/** The built server entry must provide the source-typed components used here. */
const server = (await import(serverEntry)) as ServerComponents;

/** Render matched and unmatched text through the published server entry. */
function renderServerHighlight(): string {
  return renderToString(
    /** Keep matching options inside one Mark props provider. */
    () =>
      createComponent(server.MarkPropsProvider, {
        value: {
          variant: 'text' as const,
          class: 'server-provider-mark',
          title: 'Provided match',
        },
        /** Render matches through the public Mark provider on the server. */
        get children() {
          return createComponent(server.Highlight, {
            query: ['Solid', 'fast'],
            children: 'Solid is great and Solid is fast',
            markClass: 'consumer-highlight',
          });
        },
      }),
  );
}

/** Verify semantic marks and escaped component props in SSR markup. */
function verifiesServerHighlight(): void {
  const markup = renderServerHighlight();
  expect(markup.match(/<mark\b/g)).toHaveLength(3);
  expect(markup).toContain('lui-mark');
  expect(markup.match(/server-provider-mark/g)).toHaveLength(3);
  expect(markup.match(/title="Provided match"/g)).toHaveLength(3);
  expect(markup.match(/consumer-highlight/g)).toHaveLength(3);
  expect(markup).toContain(' is great and ');
  expect(markup).toContain('>fast</mark>');
  expect(markup).not.toMatch(/<mark[^>]*\s(?:query|styles|ignoreCase|matchAll)=/);
  expect(markup).not.toMatch(/<(?:div|span)\b/);
}

test(
  'published Highlight renders styled semantic marks without a wrapper',
  verifiesServerHighlight,
);
