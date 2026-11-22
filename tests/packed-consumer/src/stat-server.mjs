import assert from 'node:assert/strict';
import { Stat } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Stat semantics through the package server entry. */
function renderPackedStat() {
  return renderToString(
    /** Establish one provider and Stat root in the server render. */
    () =>
      createComponent(Stat.Root, {
        id: 'packed-server-stat',
        /** Return the label, value, and default trend arrow. */
        get children() {
          return [
            createComponent(Stat.Label, { children: 'Visitors' }),
            createComponent(Stat.ValueText, { children: '192k' }),
            createComponent(Stat.UpIndicator, {}),
          ];
        },
      }),
  );
}

const markup = renderPackedStat();
assert.match(markup, /<dl[^>]*id="packed-server-stat"/);
assert.match(markup, /<dt[^>]*>Visitors<\/dt>/);
assert.match(markup, /<dd[^>]*>192k<\/dd>/);
assert.match(markup, /data-type="up"/);
assert.match(markup, /<svg/);
assert.doesNotMatch(markup, /<dl[^>]*\s(?:size|recipe|css|unstyled)=/);
