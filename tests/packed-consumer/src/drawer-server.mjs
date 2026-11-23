import assert from 'node:assert/strict';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import {
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  Portal,
} from '@leverui/components';

/** Render an initially open Drawer from the installed server bundle. */
function renderDrawer() {
  return createComponent(DrawerRoot, {
    defaultOpen: true,
    /** Preserve the portalled part composition. */
    get children() {
      return createComponent(Portal, {
        /** Keep the positioner under the primitive's Dialog state. */
        get children() {
          return createComponent(DrawerPositioner, {
            /** Render the native content and Drawer layout slots. */
            get children() {
              return createComponent(DrawerContent, {
                /** Keep the accessible title and description in this panel. */
                get children() {
                  return [
                    createComponent(DrawerHeader, {
                      /** Label the published Drawer content. */
                      get children() {
                        return [
                          createComponent(DrawerTitle, { children: 'Installed Drawer' }),
                          createComponent(DrawerDescription, { children: 'Drawer summary' }),
                        ];
                      },
                    }),
                    createComponent(DrawerBody, { children: 'Server body' }),
                    createComponent(DrawerFooter, { children: 'Server actions' }),
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

const markup = renderToString(renderDrawer);
assert.match(markup, /role="dialog"/);
assert.match(markup, /<div\b[^>]*lui-drawer__content/);
assert.match(markup, /<div\b[^>]*lui-drawer__description/);
assert.doesNotMatch(markup, /<(?:section|p)\b[^>]*lui-drawer__(?:content|description)/);
assert.match(markup, /aria-labelledby="[^"]+"/);
assert.match(markup, /aria-describedby="[^"]+"/);
assert.match(markup, /lui-drawer__header/);
assert.match(markup, /lui-drawer__body/);
assert.match(markup, /lui-drawer__footer/);
assert.match(markup, /Installed Drawer/);
assert.match(markup, /Server actions/);
