import assert from 'node:assert/strict';
import { EmptyState } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render published compound parts through the installed server entry. */
function renderInstalledEmptyState() {
  return renderToString(
    /** Create compound parts under the published root. */
    () =>
      createComponent(EmptyState.Root, {
        id: 'packed-server-empty',
        size: 'lg',
        role: 'status',
        /** Mount descendants inside the root style context. */
        get children() {
          return createComponent(EmptyState.Content, {
            /** Render a semantic heading and paragraph. */
            get children() {
              return [
                createComponent(EmptyState.Title, { children: 'No items' }),
                createComponent(EmptyState.Description, { children: 'Add one.' }),
              ];
            },
          });
        },
      }),
  );
}

const markup = renderInstalledEmptyState();
assert.match(markup, /<div[^>]*id="packed-server-empty"/);
assert.match(markup, /role="status"/);
assert.match(markup, /<h3[^>]*>No items<\/h3>/);
assert.match(markup, /<p[^>]*>Add one\.<\/p>/);
assert.doesNotMatch(markup, /<div[^>]*\s(?:size|recipe|css|unstyled)=/);
console.log('Packed Empty State server rendering passed.');
