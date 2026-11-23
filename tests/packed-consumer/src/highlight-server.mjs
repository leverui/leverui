import assert from 'node:assert/strict';
import { Highlight, MarkPropsProvider } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render Highlight through the independently installed server entry. */
function renderInstalledHighlight() {
  return renderToString(
    /** Render matched marks with packaged CSS. */
    () =>
      createComponent(MarkPropsProvider, {
        value: { variant: 'text', class: 'provided-mark', title: 'Provided match' },
        /** Render semantic matches through the installed Mark renderer. */
        get children() {
          return createComponent(Highlight, {
            query: 'Solid',
            children: 'Solid is fast',
          });
        },
      }),
  );
}

const markup = renderInstalledHighlight();
assert.match(markup, /<mark[^>]*class="[^"]*lui-mark[^"]*provided-mark/);
assert.match(markup, /title="Provided match"/);
assert.match(markup, />Solid<\/mark>/);
assert.doesNotMatch(markup, /<mark[^>]*\svariant=/);
console.log('Packed Highlight server rendering passed.');
