import assert from 'node:assert/strict';
import { Strong } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Strong through the public package server entry. */
function renderPackedStrong() {
  return renderToString(
    /** Provide the installed component's theme scope. */
    () =>
      createComponent(Strong, {
        id: 'packed-server-strong',
        title: 'Important content',
        children: 'Installed importance',
      }),
  );
}

const markup = renderPackedStrong();
assert.match(markup, /<strong[^>]*id="packed-server-strong"/);
assert.match(markup, /title="Important content"/);
assert.doesNotMatch(markup, /<strong[^>]*\sstyle=/);
assert.doesNotMatch(markup, /<strong[^>]*\s(?:as|asChild|css|unstyled|role)=/);
