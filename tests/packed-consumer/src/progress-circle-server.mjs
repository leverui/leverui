import assert from 'node:assert/strict';
import { ProgressCircle } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Circle machine with packaged CSS. */
function renderInstalledCircle() {
  return renderToString(
    /** Create the root beneath the Solid server owner. */
    () =>
      createComponent(ProgressCircle.Root, {
        value: 30,
        max: 60,
        size: 'lg',
        /** Render SVG parts under the primitive's machine context. */
        get children() {
          return [
            createComponent(ProgressCircle.Label, {
              id: 'packed-server-circle-label',
              children: 'Uploading',
            }),
            createComponent(ProgressCircle.Circle, {
              'aria-labelledby': 'packed-server-circle-label',
              /** Place SVG arcs beneath the progressbar. */
              get children() {
                return [
                  createComponent(ProgressCircle.Track, {}),
                  createComponent(ProgressCircle.Range, {}),
                ];
              },
            }),
            createComponent(ProgressCircle.ValueText, {}),
          ];
        },
      }),
  );
}

const markup = renderInstalledCircle();
assert.match(markup, /data-progress-/);
assert.match(markup, /data-size="lg"/);
assert.match(markup, /role="progressbar"/);
assert.match(markup, /aria-labelledby="packed-server-circle-label"/);
assert.match(markup, /aria-valuenow="30"/);
assert.match(markup, /aria-valuemax="60"/);
assert.match(markup, /lui-progress-circle__circleRange/);
assert.match(markup, /Uploading/);
assert.doesNotMatch(markup, /\s(?:size|recipe|unstyled)=/);
console.log('Packed Progress Circle server rendering passed.');
