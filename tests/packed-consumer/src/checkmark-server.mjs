import assert from 'node:assert/strict';
import { Checkmark } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render a selected Checkmark through the installed package's server entry. */
function renderInstalledCheckmark() {
  return renderToString(
    /** Render the mark through the published CSS contract. */
    () =>
      createComponent(Checkmark, {
        id: 'packed-server-checkmark',
        checked: true,
        disabled: true,
        variant: 'outline',
        size: 'lg',
      }),
  );
}

const markup = renderInstalledCheckmark();
assert.match(markup, /<svg[^>]*id="packed-server-checkmark"/);
assert.match(markup, /data-state="checked"/);
assert.match(markup, /\sdata-disabled(?:=""|(?=[\s/>]))/);
assert.match(markup, /<polyline[^>]*points="20 6 9 17 4 12"/);
assert.doesNotMatch(markup, /<svg[^>]*\s(?:checked|disabled|size|variant)=/);

const standalone = renderToString(
  /** Verify the installed SVG can render with packaged CSS. */
  () =>
    createComponent(Checkmark, {
      id: 'standalone-checkmark',
      checked: true,
      size: 'sm',
      colorPalette: 'teal',
    }),
);
assert.match(standalone, /<svg[^>]*id="standalone-checkmark"/);
assert.match(standalone, /data-size="sm"/);
assert.match(standalone, /data-lui-color-palette="teal"/);
console.log('Packed Checkmark server rendering passed.');
