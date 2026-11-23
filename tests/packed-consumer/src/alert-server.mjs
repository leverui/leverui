import assert from 'node:assert/strict';
import { Alert } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render compound Alert parts through the installed package's server entry. */
function renderInstalledAlert() {
  return renderToString(
    /** Construct compound parts with packaged CSS. */
    () =>
      createComponent(Alert.Root, {
        id: 'packed-server-alert',
        role: 'alert',
        status: 'warning',
        /** Create compound parts inside the Alert context. */
        get children() {
          return [
            createComponent(Alert.Indicator, {}),
            createComponent(Alert.Content, {
              /** Read the title only after the content part is created. */
              get children() {
                return createComponent(Alert.Title, { children: 'Caution' });
              },
            }),
          ];
        },
      }),
  );
}

const markup = renderInstalledAlert();
assert.match(markup, /<div[^>]*id="packed-server-alert"/);
assert.match(markup, /role="alert"/);
assert.match(markup, /lui-alert__indicator/);
assert.match(markup, /lui-alert__title/);
assert.match(markup, /Caution/);
assert.doesNotMatch(markup, /\s(?:status|variant|size|colorPalette)=/);
console.log('Packed Alert server rendering passed.');
