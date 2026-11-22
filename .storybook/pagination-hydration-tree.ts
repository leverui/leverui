import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  PaginationItems as ItemsExport,
  PaginationNextTrigger as NextExport,
  PaginationPageText as TextExport,
  PaginationRoot as RootExport,
} from '../src';

export interface PaginationHydrationComponents {
  PaginationItems: typeof ItemsExport;
  PaginationNextTrigger: typeof NextExport;
  PaginationPageText: typeof TextExport;
  PaginationRoot: typeof RootExport;
}

/** Build identical machine markup for the published server and browser entries. */
export function renderPaginationHydrationTree({
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationRoot,
}: PaginationHydrationComponents): JSX.Element {
  return createComponent(PaginationRoot, {
    id: 'hydrated-pagination',
    count: 30,
    pageSize: 10,
    defaultPage: 1,
    /** Render page items, navigation, and text in one machine scope. */
    get children(): JSX.Element {
      return [
        createComponent(PaginationItems, {}),
        createComponent(PaginationNextTrigger, {
          id: 'hydrated-pagination-next',
          children: 'Next page',
        }),
        createComponent(PaginationPageText, { id: 'hydrated-pagination-text' }),
      ];
    },
  });
}
