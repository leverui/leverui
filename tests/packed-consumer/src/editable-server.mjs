import assert from 'node:assert/strict';
import { Editable } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Editable through its published server entry. */
function renderInstalledEditable() {
  return renderToString(
    /** Keep the Editable machine and parts under one owner. */
    () =>
      createComponent(Editable.Root, {
        id: 'packed-server-editable',
        defaultValue: 'Packed value',
        /** Render the preview and native input together. */
        get children() {
          return [
            createComponent(Editable.Label, { children: 'Name' }),
            createComponent(Editable.Preview, {}),
            createComponent(Editable.Input, {}),
          ];
        },
      }),
  );
}

const markup = renderInstalledEditable();
assert.match(markup, /data-editable-/);
assert.match(markup, /lui-editable__root/);
assert.match(markup, /lui-editable__input/);
assert.match(markup, /Packed value/);
assert.doesNotMatch(markup, /\s(?:recipe|unstyled|activationMode)=/);
console.log('Packed Editable server rendering passed.');
