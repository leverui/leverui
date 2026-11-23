import assert from 'node:assert/strict';
import { Container } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Container from the published node entry. */
function renderInstalledContainer() {
  return renderToString(
    /** Render Container through the published server entry. */
    () =>
      createComponent(Container, {
        id: 'packed-server-container',
        fluid: true,
        centerContent: true,
        children: 'Installed server container',
      }),
  );
}

const markup = renderInstalledContainer();
assert.match(markup, /id="packed-server-container"/);
assert.match(markup, /Installed server container/);
assert.match(markup, /lui-container/);
assert.match(markup, /data-center-content-base="true"/);
assert.match(markup, /data-fluid-base="true"/);
assert.doesNotMatch(markup, /\s(?:fluid|centerContent)=/);
console.log('Packed Container server rendering passed.');
