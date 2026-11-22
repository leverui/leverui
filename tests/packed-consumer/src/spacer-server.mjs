import assert from 'node:assert/strict';
import { Spacer } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Spacer through the published server entry. */
function renderInstalledSpacer() {
  return renderToString(
    /** Supply the package's native server rendering context. */
    () =>
      createComponent(Spacer, {
        id: 'packed-server-spacer',
        title: 'Installed spacer',
        flex: 2,
      }),
  );
}

const markup = renderInstalledSpacer();
assert.match(markup, /id="packed-server-spacer"/);
assert.match(markup, /title="Installed spacer"/);
assert.match(markup, /leverui-spacer/);
assert.match(markup, /--leverui-private-spacer-flex-base:2/);
assert.doesNotMatch(markup, /\s(?:css|unstyled|asChild)=/);
console.log('Packed Spacer server rendering passed.');
