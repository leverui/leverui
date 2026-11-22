import assert from 'node:assert/strict';
import { Progress } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Progress machine with packaged CSS. */
function renderInstalledProgress() {
  return renderToString(
    /** Create the primitive root beneath the Solid server owner. */
    () =>
      createComponent(Progress.Root, {
        value: 30,
        max: 60,
        size: 'lg',
        /** Render native parts under the primitive's machine context. */
        get children() {
          return [
            createComponent(Progress.Label, {
              id: 'packed-server-progress-label',
              children: 'Uploading',
            }),
            createComponent(Progress.ValueText, {}),
            createComponent(Progress.Track, {
              'aria-labelledby': 'packed-server-progress-label',
              /** Keep the range inside the progressbar track. */
              get children() {
                return createComponent(Progress.Range, {});
              },
            }),
          ];
        },
      }),
  );
}

const markup = renderInstalledProgress();
assert.match(markup, /data-progress-/);
assert.match(markup, /data-size="lg"/);
assert.match(markup, /role="progressbar"/);
assert.match(markup, /aria-labelledby="packed-server-progress-label"/);
assert.match(markup, /aria-valuenow="30"/);
assert.match(markup, /aria-valuemax="60"/);
assert.match(markup, /leverui-progress__range/);
assert.match(markup, /width:50%/);
assert.doesNotMatch(markup, /\s(?:size|recipe|striped|animated)=/);
console.log('Packed Progress server rendering passed.');
