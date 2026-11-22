import assert from 'node:assert/strict';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { PaginationItems, PaginationPageText, PaginationRoot } from '@leverui/components';

/** Render the installed Pagination package in an isolated Solid consumer. */
function renderPagination() {
  return createComponent(PaginationRoot, {
    count: 30,
    pageSize: 10,
    defaultPage: 2,
    /** Keep items and count text inside the same machine. */
    get children() {
      return [
        createComponent(PaginationItems, {}),
        createComponent(PaginationPageText, { format: 'long' }),
      ];
    },
  });
}

const markup = renderToString(renderPagination);
assert.match(markup, /data-pagination-/);
assert.match(markup, /aria-current="page"/);
assert.match(markup, /11 - 20 of 30/);
