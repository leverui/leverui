import assert from 'node:assert/strict';
import { Text } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render a semantic Text element with authored clipping hooks. */
function renderText() {
  return renderToString(
    /** Render the installed Text with packaged CSS. */
    () =>
      createComponent(Text, {
        as: 'article',
        id: 'packed-server-text',
        lineClamp: '2',
        children: 'Server text',
      }),
  );
}

const markup = renderText();
assert.match(markup, /<article[^>]*id="packed-server-text"/);
assert.match(markup, /leverui-text/);
assert.match(markup, /data-line-clamp="value"/);
assert.match(markup, /--leverui-private-text-line-clamp:2/);
console.log('Packed Text server rendering passed.');
