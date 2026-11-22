import assert from 'node:assert/strict';
import { Em, Quote, Span, Strong } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render authored semantic typography through the installed server entry. */
function renderSemanticInline() {
  return renderToString(
    /** Keep the semantic element under the public provider. */
    () => [
      createComponent(Em, { id: 'packed-server-em', children: 'Server emphasis' }),
      createComponent(Strong, { id: 'packed-server-strong', children: 'Server importance' }),
      createComponent(Quote, { id: 'packed-server-quote', children: 'Server quotation' }),
      createComponent(Span, { id: 'packed-server-span', children: 'Server inline text' }),
    ],
  );
}

const markup = renderSemanticInline();
assert.match(markup, /<em[^>]*id="packed-server-em"/);
assert.match(markup, /leverui-em/);
assert.match(markup, /<strong[^>]*id="packed-server-strong"/);
assert.match(markup, /leverui-strong/);
assert.match(markup, /<q[^>]*id="packed-server-quote"/);
assert.match(markup, /leverui-quote/);
assert.match(markup, /<span[^>]*id="packed-server-span"/);
assert.match(markup, /leverui-span/);
console.log('Packed semantic typography server rendering passed.');
