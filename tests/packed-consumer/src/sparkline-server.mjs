import assert from 'node:assert/strict';
import { Sparkline } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Sparkline with packaged CSS. */
function renderSparkline() {
  return renderToString(
    /** Keep the initial area and path available in server markup. */
    () =>
      createComponent(Sparkline, {
        data: [{ value: 12 }, { value: 18 }],
        type: 'area',
        color: 'teal.500',
        'aria-label': 'Traffic',
      }),
  );
}

const markup = renderSparkline();
assert.match(markup, /leverui-sparkline/);
assert.match(markup, /leverui-sparkline__area/);
assert.match(markup, /--leverui-sparkline-color/);
assert.match(markup, /aria-label="Traffic"/);
console.log('Packed Sparkline server rendering passed.');
