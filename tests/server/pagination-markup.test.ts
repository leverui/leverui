import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  PaginationItems as ItemsExport,
  PaginationNextTrigger as NextExport,
  PaginationPageText as TextExport,
  PaginationPrevTrigger as PrevExport,
  PaginationRoot as RootExport,
} from '../../src';

type ServerComponents = {
  PaginationItems: typeof ItemsExport;
  PaginationNextTrigger: typeof NextExport;
  PaginationPageText: typeof TextExport;
  PaginationPrevTrigger: typeof PrevExport;
  PaginationRoot: typeof RootExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a complete Pagination from the published server entry. */
function renderServerPagination(unstyled = false): string {
  return renderToString(
    /** Compose the navigation landmark and page parts without a style provider. */
    () =>
      createComponent(server.PaginationRoot, {
        count: 50,
        pageSize: 10,
        defaultPage: 2,
        unstyled,
        'aria-label': 'Article pages',
        /** Render machine parts beneath the root context. */
        get children(): JSX.Element {
          return [
            createComponent(server.PaginationPrevTrigger, { children: 'Previous' }),
            createComponent(server.PaginationItems, {}),
            createComponent(server.PaginationNextTrigger, { children: 'Next' }),
            createComponent(server.PaginationPageText, { format: 'long' as const }),
          ];
        },
      }),
  );
}

/** Verify semantic navigation, selected page, range text, and owned classes. */
function verifiesServerMarkup(): void {
  const markup = renderServerPagination();
  expect(markup).toMatch(/<nav\b[^>]*aria-label="Article pages"/);
  expect(markup).toContain('lui-pagination__root');
  expect(markup).toContain('lui-pagination__item');
  expect(markup).toContain('lui-pagination__page-text');
  expect(markup).toContain('aria-current="page"');
  expect(markup).toContain('11 - 20 of 50');
}

test('published Pagination renders semantic server markup', verifiesServerMarkup);

/** Keep unstyled root and part hooks without inserting presentation CSS. */
function verifiesUnstyledServerMarkup(): void {
  const markup = renderServerPagination(true);
  expect(markup.match(/\sdata-unstyled(?:=""|(?=[\s/>]))/g)?.length).toBeGreaterThan(2);
  expect(markup).toContain('lui-pagination__page-text');
}

test(
  'published Pagination retains unstyled parts without a provider',
  verifiesUnstyledServerMarkup,
);
