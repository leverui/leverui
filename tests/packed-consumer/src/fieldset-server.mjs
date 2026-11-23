import assert from 'node:assert/strict';
import { Fieldset } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Fieldset parts through the published server entry. */
function renderInstalledFieldset() {
  return renderToString(
    /** Create both styling and primitive contexts in the same server owner. */
    () =>
      createComponent(Fieldset.Root, {
        id: 'packed-server-group',
        disabled: true,
        invalid: true,
        /** Render each associated part from the installed package. */
        get children() {
          return [
            createComponent(Fieldset.Legend, { children: 'Server contact' }),
            createComponent(Fieldset.HelperText, { children: 'Server guidance' }),
            createComponent(Fieldset.Content, { children: 'Server controls' }),
            createComponent(Fieldset.ErrorText, { children: 'Server error' }),
          ];
        },
      }),
  );
}

const markup = renderInstalledFieldset();
assert.match(markup, /<fieldset[^>]*disabled/);
assert.match(markup, /lui-fieldset__root/);
assert.match(markup, /lui-fieldset__legend/);
assert.match(markup, /lui-fieldset__content/);
assert.match(markup, /lui-fieldset__errorText/);
assert.match(markup, /aria-labelledby="fieldset::packed-server-group::legend"/);
assert.match(markup, /Server error/);
assert.doesNotMatch(markup, /\s(?:recipe|unstyled|size)=/);
console.log('Packed Fieldset server rendering passed.');
