import assert from 'node:assert/strict';
import { Status } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Status parts through the package server entry. */
function renderPackedStatus() {
  return renderToString(
    /** Render the component through the published server entry. */
    () =>
      createComponent(Status.Root, {
        id: 'packed-server-status',
        colorPalette: 'green',
        /** Mount the indicator after its root style context exists. */
        get children() {
          return [createComponent(Status.Indicator, {}), 'Ready'];
        },
      }),
  );
}

const markup = renderPackedStatus();
assert.match(markup, /<div[^>]*id="packed-server-status"/);
assert.match(markup, /status__indicator/);
assert.match(markup, /Ready/);
assert.doesNotMatch(markup, /<div[^>]*\s(?:size|recipe|css|unstyled|colorPalette)=/);
