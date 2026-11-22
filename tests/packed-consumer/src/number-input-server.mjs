import assert from 'node:assert/strict';
import { NumberInput } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Number Input through its published server entry. */
function renderInstalledNumberInput() {
  return renderToString(
    /** Keep style and machine providers in the same Solid owner. */
    () =>
      createComponent(NumberInput.Root, {
        defaultValue: 2,
        name: 'quantity',
        /** Render the number field, its form value, and default controls. */
        get children() {
          return [
            createComponent(NumberInput.Label, { children: 'Quantity' }),
            createComponent(NumberInput.Input, {}),
            createComponent(NumberInput.HiddenInput, {}),
            createComponent(NumberInput.Control, {}),
          ];
        },
      }),
  );
}

const markup = renderInstalledNumberInput();
assert.match(markup, /data-number-input-/);
assert.match(markup, /leverui-number-input__root/);
// Zag 2 renders a text field described as a number field, not a spinbutton.
assert.match(markup, /aria-roledescription="number field"/);
assert.match(markup, /name="quantity"/);
assert.doesNotMatch(markup, /\s(?:recipe|unstyled|size)=/);
console.log('Packed Number Input server rendering passed.');
