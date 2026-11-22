import assert from 'node:assert/strict';
import { Field, Textarea } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Textarea from its published server entry. */
function renderInstalledTextarea() {
  return renderToString(
    /** Establish the style system before the Field context. */
    () =>
      createComponent(Field.Root, {
        id: 'packed-server-notes',
        required: true,
        /** Render the label and default text together on the server. */
        get children() {
          return [
            createComponent(Field.Label, { children: 'Server notes' }),
            createComponent(Textarea, { defaultValue: 'Draft notes', size: 'md' }),
          ];
        },
      }),
  );
}

const markup = renderInstalledTextarea();
assert.match(markup, /leverui-textarea/);
assert.match(markup, /<textarea\b[^>]*>Draft notes<\/textarea>/);
assert.match(markup, /for="packed-server-notes"/);
assert.match(markup, /required/);
assert.doesNotMatch(markup, /\s(?:recipe|unstyled|size|autoresize)=/);
const standalone = renderToString(
  /** Render the installed control with packaged CSS. */
  () => createComponent(Textarea, { 'aria-label': 'Standalone notes' }),
);
assert.match(standalone, /class="leverui-textarea/);
console.log('Packed Textarea server rendering passed.');
