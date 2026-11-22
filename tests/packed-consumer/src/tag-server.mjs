import assert from 'node:assert/strict';
import { TagCloseTrigger, TagEndElement, TagLabel, TagRoot } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Tag parts through the package's server entry. */
function renderPackedTag() {
  return renderToString(
    /** Establish the installed theme provider. */
    () =>
      createComponent(TagRoot, {
        id: 'packed-server-tag',
        size: 'sm',
        /** Render a label and close control inside Tag context. */
        get children() {
          return [
            createComponent(TagLabel, { children: 'Installed category' }),
            createComponent(TagEndElement, {
              /** Keep the default close glyph inside the end slot. */
              get children() {
                return createComponent(TagCloseTrigger, {});
              },
            }),
          ];
        },
      }),
  );
}

const markup = renderPackedTag();
assert.match(markup, /<div[^>]*id="packed-server-tag"/);
assert.match(markup, /<span[^>]*>Installed category<\/span>/);
assert.match(markup, /<button[^>]*type="button"/);
assert.match(markup, /<button[^>]*aria-label="Close"/);
assert.match(markup, /leverui-tag__closeTrigger/);
assert.doesNotMatch(markup, /<div[^>]*\s(?:size|variant)=/);
