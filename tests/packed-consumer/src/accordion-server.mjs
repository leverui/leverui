import assert from 'node:assert/strict';
import { Accordion } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render one installed Accordion with packaged CSS. */
function renderInstalledAccordion() {
  return renderToString(
    /** Construct parts inside the primitive's root and item contexts. */
    () =>
      createComponent(Accordion.Root, {
        id: 'packed-server-accordion',
        defaultValue: ['first'],
        variant: 'subtle',
        /** Create the item after the root establishes its machine. */
        get children() {
          return createComponent(Accordion.Item, {
            value: 'first',
            /** Keep the trigger and content under the same item. */
            get children() {
              return [
                createComponent(Accordion.ItemTrigger, { children: 'Installed trigger' }),
                createComponent(Accordion.ItemContent, {
                  /** Render panel content inside the primitive's presence boundary. */
                  get children() {
                    return createComponent(Accordion.ItemBody, { children: 'Installed panel' });
                  },
                }),
              ];
            },
          });
        },
      }),
  );
}

const markup = renderInstalledAccordion();
assert.match(markup, /data-accordion-root="packed-server-accordion"/);
assert.match(markup, /data-variant="subtle"/);
assert.match(markup, /lui-accordion__itemTrigger/);
assert.match(markup, /Installed panel/);
console.log('Packed Accordion server rendering passed.');
