import assert from 'node:assert/strict';
import { Separator } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render a published separator from the installed server entry. */
function renderPackedSeparator() {
  return renderToString(
    /** Render the installed component with packaged CSS. */
    () =>
      createComponent(Separator, {
        id: 'packed-server-separator',
        orientation: 'vertical',
        style: { height: '24px' },
      }),
  );
}

const markup = renderPackedSeparator();
assert.match(markup, /<span[^>]*id="packed-server-separator"/);
assert.match(markup, /role="separator"/);
assert.match(markup, /aria-orientation="vertical"/);
assert.match(markup, /lui-separator/);
assert.match(markup, /data-orientation="vertical"/);
assert.doesNotMatch(markup, /--separator-thickness/);
assert.doesNotMatch(markup, /<span[^>]*\s(?:orientation|variant|size|css|unstyled)=/);
