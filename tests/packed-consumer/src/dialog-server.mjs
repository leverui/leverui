import assert from 'node:assert/strict';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Portal,
} from '@leverui/components';

/** Render an initially open Dialog through the installed server entry. */
function renderDialog() {
  return createComponent(DialogRoot, {
    defaultOpen: true,
    /** Keep the open content beneath the primitive's machine context. */
    get children() {
      return createComponent(Portal, {
        /** Match the public portalled composition on the server. */
        get children() {
          return createComponent(DialogPositioner, {
            /** Render the accessible panel and layout slots. */
            get children() {
              return createComponent(DialogContent, {
                /** Keep title, body, and footer in one Dialog. */
                get children() {
                  return [
                    createComponent(DialogHeader, {
                      /** Label the installed Dialog content. */
                      get children() {
                        return createComponent(DialogTitle, { children: 'Installed Dialog' });
                      },
                    }),
                    createComponent(DialogBody, { children: 'Server body' }),
                    createComponent(DialogFooter, { children: 'Server actions' }),
                  ];
                },
              });
            },
          });
        },
      });
    },
  });
}

const markup = renderToString(renderDialog);
assert.match(markup, /role="dialog"/);
assert.match(markup, /aria-labelledby="[^"]+"/);
assert.match(markup, /leverui-dialog__header/);
assert.match(markup, /leverui-dialog__body/);
assert.match(markup, /leverui-dialog__footer/);
assert.match(markup, /Installed Dialog/);
assert.match(markup, /Server actions/);
