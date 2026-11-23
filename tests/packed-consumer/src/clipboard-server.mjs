import assert from 'node:assert/strict';
import { Clipboard, ClipboardRoot } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Verify the installed Node entry renders named and compound Clipboard parts. */
function renderPackedClipboard() {
  return renderToString(
    /** Establish the public style context before creating the primitive machine. */
    () => [
      createComponent(Clipboard.Root, {
        value: 'Packed Clipboard value',
        /** Render label, input, trigger, and reactive value. */
        get children() {
          return [
            createComponent(Clipboard.Label, { children: 'Packed copy label' }),
            createComponent(Clipboard.Input, {}),
            createComponent(Clipboard.Trigger, { children: 'Copy packed value' }),
            createComponent(Clipboard.ValueText, {}),
          ];
        },
      }),
      createComponent(ClipboardRoot, {
        value: 'Named packed value',
        /** Show the named root's machine value in server markup. */
        get children() {
          return createComponent(Clipboard.ValueText, {});
        },
      }),
    ],
  );
}

const markup = renderPackedClipboard();
assert.match(markup, /lui-clipboard__root/);
assert.match(markup, /lui-clipboard__trigger/);
assert.match(markup, /Packed Clipboard value/);
assert.match(markup, /Packed copy label/);
assert.match(markup, /Named packed value/);
