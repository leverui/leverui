import assert from 'node:assert/strict';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import {
  PopoverArrow,
  PopoverBody,
  PopoverCloseTrigger,
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from '@leverui/components';

/** Render an initially open Popover through the installed server entry. */
function renderPopover() {
  return createComponent(PopoverRoot, {
    defaultOpen: true,
    /** Keep trigger and surface beneath one Popover machine. */
    get children() {
      return [
        createComponent(PopoverTrigger, { children: 'Details' }),
        createComponent(PopoverPositioner, {
          /** Render accessible parts under the primitive presence. */
          get children() {
            return createComponent(PopoverContent, {
              /** Preserve the title and close action in server markup. */
              get children() {
                return [
                  createComponent(PopoverArrow, {}),
                  createComponent(PopoverTitle, { children: 'Account' }),
                  createComponent(PopoverBody, { children: 'Account details' }),
                  createComponent(PopoverCloseTrigger, { children: 'Close' }),
                ];
              },
            });
          },
        }),
      ];
    },
  });
}

const markup = renderToString(renderPopover);
assert.match(markup, /leverui-popover__content/);
assert.match(markup, /role="dialog"/);
assert.match(markup, /leverui-popover__arrowTip/);
assert.match(markup, /<h2\b/);
assert.match(markup, /data-popover-close-trigger/);
