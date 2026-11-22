import assert from 'node:assert/strict';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import {
  MenuArrow,
  MenuContent,
  MenuItem,
  MenuItemCommand,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from '@leverui/components';

/** Render an initially open menu through the installed server entry. */
function renderMenu() {
  return createComponent(MenuRoot, {
    defaultOpen: true,
    /** Keep the trigger and surface under one primitive machine. */
    get children() {
      return [
        createComponent(MenuTrigger, { children: 'Actions' }),
        createComponent(MenuPositioner, {
          /** Render native menu parts under the primitive presence. */
          get children() {
            return createComponent(MenuContent, {
              /** Preserve item values and default arrow composition. */
              get children() {
                return [
                  createComponent(MenuArrow, {}),
                  createComponent(MenuItem, { value: 'save', children: 'Save' }),
                  createComponent(MenuItemCommand, { children: '⌘S' }),
                  createComponent(MenuSeparator, {}),
                ];
              },
            });
          },
        }),
      ];
    },
  });
}

const markup = renderToString(renderMenu);
assert.match(markup, /leverui-menu__content/);
assert.match(markup, /role="menu"/);
assert.match(markup, /leverui-menu__arrowTip/);
assert.match(markup, /role="menuitem"/);
assert.match(markup, /<kbd\b/);
assert.match(markup, /<hr\b/);
