import assert from 'node:assert/strict';
import { ActionBar } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Verify the installed server export renders with packaged CSS. */
function renderPackedActionBar() {
  return renderToString(
    /** Construct the primitive machine through the installed package. */
    () =>
      createComponent(ActionBar.Root, {
        open: true,
        placement: 'bottom-start',
        /** Expose the fixed positioner in server markup. */
        get children() {
          return createComponent(ActionBar.Positioner, {
            /** Render content through the published primitive adapter. */
            get children() {
              return createComponent(ActionBar.Content, {
                'aria-label': 'Installed actions',
                /** Render a non-submitting selection control. */
                get children() {
                  return createComponent(ActionBar.SelectionTrigger, { children: '1 selected' });
                },
              });
            },
          });
        },
      }),
  );
}

const markup = renderPackedActionBar();
assert.match(markup, /lui-action-bar__content/);
assert.match(markup, /data-placement="bottom-start"/);
assert.match(markup, /1 selected/);
assert.match(markup, /type="button"/);
