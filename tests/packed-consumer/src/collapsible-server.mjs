import assert from 'node:assert/strict';
import { Collapsible } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Verify the installed Node entry renders an open disclosure. */
function renderPackedCollapsible() {
  return renderToString(
    /** Establish styling before the primitive creates the disclosure machine. */
    () =>
      createComponent(Collapsible.Root, {
        defaultOpen: true,
        /** Render the trigger and visible content from the package. */
        get children() {
          return [
            createComponent(Collapsible.Trigger, { children: 'Toggle packed details' }),
            createComponent(Collapsible.Content, { children: 'Packed disclosure details' }),
          ];
        },
      }),
  );
}

const markup = renderPackedCollapsible();
assert.match(markup, /lui-collapsible__content/);
assert.match(markup, /Packed disclosure details/);
assert.match(markup, /aria-expanded="true"/);
