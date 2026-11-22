import assert from 'node:assert/strict';
import { PinInput } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Pin Input through its published server entry. */
function renderInstalledPinInput() {
  return renderToString(
    /** Keep style and machine providers in the same Solid owner. */
    () =>
      createComponent(PinInput.Root, {
        count: 2,
        name: 'code',
        mask: true,
        /** Render native form and indexed fields. */
        get children() {
          return [
            createComponent(PinInput.HiddenInput, {}),
            createComponent(PinInput.Control, {
              /** Keep the index contract in the public package. */
              get children() {
                return [
                  createComponent(PinInput.Input, { index: 0 }),
                  createComponent(PinInput.Input, { index: 1 }),
                ];
              },
            }),
          ];
        },
      }),
  );
}

const markup = renderInstalledPinInput();
assert.match(markup, /data-pin-input-/);
assert.match(markup, /leverui-pin-input__root/);
assert.match(markup, /leverui-pin-input__input/);
assert.match(markup, /leverui-input/);
assert.match(markup, /data-size="md"/);
assert.match(markup, /data-variant="outline"/);
assert.match(markup, /<input[^>]*data-pin-input-input[^>]*type="password"/);
assert.match(markup, /name="code"/);
assert.doesNotMatch(markup, /\s(?:recipe|unstyled|size)=/);
console.log('Packed Pin Input server rendering passed.');
