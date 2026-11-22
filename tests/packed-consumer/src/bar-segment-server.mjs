import assert from 'node:assert/strict';
import { BarSegment, useChart } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Bar Segment with native size and proportional fill. */
function renderBarSegment() {
  return renderToString(
    /** Build the chart model inside this server request. */
    () => {
      const chart = useChart({ data: [{ name: 'Direct', value: 50, color: 'teal.500' }] });
      return createComponent(BarSegment.Root, {
        chart,
        barSize: '3rem',
        /** Keep the visible bar under the public chart context. */
        get children() {
          return createComponent(BarSegment.Content, {
            /** Render the same data as labels and colored segments. */
            get children() {
              return [createComponent(BarSegment.Label, {}), createComponent(BarSegment.Bar, {})];
            },
          });
        },
      });
    },
  );
}

const markup = renderBarSegment();
assert.match(markup, /leverui-bar-segment__root/);
assert.match(markup, /leverui-bar-segment__segment/);
assert.match(markup, /--leverui-bar-segment-size:3rem/);
assert.match(markup, /--leverui-private-bar-segment-flex/);
console.log('Packed Bar Segment server rendering passed.');
