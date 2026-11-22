import assert from 'node:assert/strict';
import { Loader, LoaderOverlay } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Loader and Overlay with packaged CSS. */
function renderInstalledLoader() {
  return renderToString(
    /** Construct the native family through the published server entry. */
    () => [
      createComponent(Loader, { id: 'server-loader', text: 'Working', children: 'Ready' }),
      createComponent(LoaderOverlay, { id: 'server-overlay', children: 'Overlay' }),
    ],
  );
}

const markup = renderInstalledLoader();
assert.match(markup, /leverui-loader/);
assert.match(markup, /leverui-loader-overlay/);
