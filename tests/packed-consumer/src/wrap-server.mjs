import assert from 'node:assert/strict';
import { Wrap, WrapItem } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Wrap parts through the published server entry. */
function renderInstalledWrap() {
  return renderToString(
    /** Render Wrap through the published server entry. */
    () =>
      createComponent(Wrap, {
        id: 'packed-server-wrap',
        title: 'Installed wrap',
        gap: '4',
        justify: 'center',
        /** Render an item inside the flex parent. */
        get children() {
          return createComponent(WrapItem, {
            id: 'packed-server-wrap-item',
            children: 'Server wrap item',
          });
        },
      }),
  );
}

const markup = renderInstalledWrap();
assert.match(markup, /id="packed-server-wrap"/);
assert.match(markup, /title="Installed wrap"/);
assert.match(markup, /Server wrap item/);
assert.match(markup, /class="leverui-wrap[\s"]/);
assert.match(markup, /leverui-wrap__listitem/);
assert.match(markup, /\sdata-wrap-gap-base(?:=""|(?=[\s/>]))/);
assert.match(markup, /--lui-private-wrap-gap-base:var\(--lui-spacing-4\)/);
assert.doesNotMatch(markup, /\s(?:justify|align|direction|css|unstyled|asChild)=/);
console.log('Packed Wrap server rendering passed.');
