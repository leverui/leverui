import assert from 'node:assert/strict';
import { Spinner, SpinnerPropsProvider } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Spinner with packaged CSS. */
function renderInstalledSpinner() {
  return renderToString(
    /** Construct inherited Spinner choices in the server entry. */
    () =>
      createComponent(SpinnerPropsProvider, {
        value: { size: 'lg', class: 'provider-spinner' },
        /** Render one semantic consumer-owned status indicator. */
        get children() {
          return createComponent(Spinner, {
            id: 'packed-server-spinner',
            role: 'status',
            'aria-label': 'Server work',
          });
        },
      }),
  );
}

const markup = renderInstalledSpinner();
assert.match(markup, /<span[^>]*id="packed-server-spinner"/);
assert.match(markup, /leverui-spinner/);
assert.match(markup, /provider-spinner/);
assert.match(markup, /data-size="lg"/);
