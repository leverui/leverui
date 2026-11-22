import assert from 'node:assert/strict';
import { Radiomark } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Radiomark through its published server entry. */
function renderInstalledRadiomark() {
  return renderToString(
    /** Render the visual mark with packaged CSS. */
    () =>
      createComponent(Radiomark, {
        id: 'packed-server-radiomark',
        checked: true,
        disabled: true,
        variant: 'outline',
        size: 'lg',
      }),
  );
}

const markup = renderInstalledRadiomark();
assert.match(markup, /<span[^>]*id="packed-server-radiomark"/);
assert.match(markup, /\sdata-checked(?:=""|(?=[\s/>]))/);
assert.match(markup, /\sdata-disabled(?:=""|(?=[\s/>]))/);
assert.match(markup, /<span[^>]*class="dot leverui-radiomark__dot"[^>]*><\/span>/);
assert.doesNotMatch(markup, /<span[^>]*\s(?:checked|disabled|size|variant)=/);
console.log('Packed Radiomark server rendering passed.');
