import assert from 'node:assert/strict';
import { Quote } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed quotation through the package's server entry. */
function renderPackedQuote() {
  return renderToString(
    /** Start the component with packaged CSS. */
    () =>
      createComponent(Quote, {
        id: 'packed-server-quote',
        cite: 'https://example.com/packed-server',
        children: 'Installed quotation',
      }),
  );
}

const markup = renderPackedQuote();
assert.match(markup, /<q[^>]*id="packed-server-quote"/);
assert.match(markup, /cite="https:\/\/example.com\/packed-server"/);
assert.match(markup, /leverui-quote/);
assert.doesNotMatch(markup, /<q[^>]*\sstyle=/);
assert.doesNotMatch(markup, /<q[^>]*\s(?:as|css|unstyled)=/);
