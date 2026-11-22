import assert from 'node:assert/strict';
import { BlockquoteRoot, BlockquoteContent, BlockquoteCaption } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render Blockquote through the installed package's server entry. */
function renderInstalledBlockquote() {
  return renderToString(
    /** Exercise the installed package's provider and native quote parts. */
    () =>
      createComponent(BlockquoteRoot, {
        id: 'packed-server-blockquote',
        variant: 'solid',
        /** Construct quote parts only after their root context exists. */
        get children() {
          return [
            createComponent(BlockquoteContent, { children: 'Installed quote' }),
            createComponent(BlockquoteCaption, { children: 'Installed author' }),
          ];
        },
      }),
  );
}

const markup = renderInstalledBlockquote();
assert.match(markup, /<figure[^>]*id="packed-server-blockquote"/);
assert.match(markup, /leverui-blockquote/);
assert.match(markup, /<blockquote[^>]*>Installed quote<\/blockquote>/);
assert.match(markup, /<figcaption[^>]*>Installed author<\/figcaption>/);
assert.doesNotMatch(markup, /\svariant="solid"/);
console.log('Packed Blockquote server rendering passed.');
