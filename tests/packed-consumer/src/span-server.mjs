import assert from 'node:assert/strict';
import { Span } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render an installed Span through the package server entry. */
function renderPackedSpan() {
  return renderToString(
    /** Render the installed Span with packaged CSS. */
    () =>
      createComponent(Span, {
        id: 'packed-server-span',
        title: 'Installed segment',
        style: { color: 'var(--lui-colors-red-500)' },
        children: 'Installed text',
      }),
  );
}

const markup = renderPackedSpan();
assert.match(markup, /<span[^>]*id="packed-server-span"/);
assert.match(markup, /title="Installed segment"/);
assert.match(markup, /var\(--lui-colors-red-500\)/);
assert.doesNotMatch(markup, /<span[^>]*\s(?:as|asChild|css|unstyled|role)=/);
