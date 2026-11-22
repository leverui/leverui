import assert from 'node:assert/strict';
import { Field, Input } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the public Field parts from the installed server entry. */
function renderInstalledField() {
  return renderToString(
    /** Establish both styling and primitive contexts for the compound control. */
    () =>
      createComponent(Field.Root, {
        id: 'packed-server-field',
        required: true,
        invalid: true,
        /** Render every visible associated part through the package. */
        get children() {
          return [
            createComponent(Field.Label, { children: 'Server email' }),
            createComponent(Input, { type: 'email' }),
            createComponent(Field.HelperText, { children: 'Server helper' }),
            createComponent(Field.ErrorText, { children: 'Server error' }),
          ];
        },
      }),
  );
}

const markup = renderInstalledField();
assert.match(markup, /leverui-field__root/);
assert.match(markup, /leverui-field__label/);
assert.match(markup, /leverui-field__helperText/);
assert.match(markup, /leverui-field__errorText/);
assert.match(markup, /data-orientation="vertical"/);
assert.match(markup, /for="packed-server-field"/);
assert.match(markup, /aria-invalid="true"/);
assert.match(markup, /required/);
assert.doesNotMatch(markup, /\s(?:recipe|unstyled|orientation)=/);
console.log('Packed Field server rendering passed.');
