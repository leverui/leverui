import assert from 'node:assert/strict';
import { Portal } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed portal's children inline on the server. */
function renderPackedPortal() {
  return createComponent(Portal, { children: ['Installed ', 'portal'] });
}

const markup = renderToString(renderPackedPortal).replace(/<!--.*?-->/g, '');
assert.equal(markup, 'Installed portal');
console.log('Packed portal server rendering passed.');
