import assert from 'node:assert/strict';
import { Group } from '@leverui/components';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString } from '@solidjs/web';

/** Render installed Group through the published server entry. */
function renderInstalledGroup() {
  return renderToString(
    /** Render Group through the published server entry. */
    () =>
      createComponent(Group, {
        id: 'packed-server-group',
        orientation: 'vertical',
        attached: true,
        /** Keep button children directly inside the Group. */
        get children() {
          return [
            createComponent(Dynamic, { component: 'button', children: 'First' }),
            createComponent(Dynamic, { component: 'button', children: 'Last' }),
          ];
        },
      }),
  );
}

const markup = renderInstalledGroup();
assert.match(markup, /id="packed-server-group"/);
assert.match(markup, /lui-group/);
assert.match(markup, /First/);
assert.match(markup, /Last/);
assert.match(markup, /data-orientation="vertical"/);
assert.match(markup, /\sdata-attached(?:=""|(?=[\s/>]))/);
assert.doesNotMatch(markup, /\s(?:orientation|attached|skip|css)=/);
console.log('Packed Group server rendering passed.');
