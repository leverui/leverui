import assert from 'node:assert/strict';
import { BarList, useChart } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render an installed Bar List with packaged CSS. */
function renderBarList() {
  return renderToString(
    /** Create chart state inside the server request. */
    () => {
      const chart = useChart({
        data: [
          { name: 'Direct', value: 50 },
          { name: 'Referral', value: 25 },
        ],
      });
      return createComponent(BarList.Root, {
        chart,
        barSize: '3rem',
        /** Keep row consumers under the installed chart context. */
        get children() {
          return createComponent(BarList.Content, {
            /** Render bars and values from the same chart accessor. */
            get children() {
              return [createComponent(BarList.Bar, {}), createComponent(BarList.Value, {})];
            },
          });
        },
      });
    },
  );
}

const markup = renderBarList();
assert.match(markup, /lui-bar-list__root/);
assert.match(markup, /lui-bar-list__fill/);
assert.match(markup, /--lui-bar-list-size:3rem/);
assert.match(markup, /--lui-private-bar-list-width:100%/);
console.log('Packed Bar List server rendering passed.');
