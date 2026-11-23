import assert from 'node:assert/strict';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import {
  TooltipArrow,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from '@leverui/components';

/** Render an initially open Tooltip through the installed server entry. */
function renderTooltip() {
  return createComponent(TooltipRoot, {
    defaultOpen: true,
    /** Keep trigger and surface beneath one Tooltip machine. */
    get children() {
      return [
        createComponent(TooltipTrigger, { children: 'Details' }),
        createComponent(TooltipPositioner, {
          /** Render the accessible surface under the primitive presence. */
          get children() {
            return createComponent(TooltipContent, {
              /** Preserve the arrow and description in server markup. */
              get children() {
                return [createComponent(TooltipArrow, {}), 'Account settings'];
              },
            });
          },
        }),
      ];
    },
  });
}

const markup = renderToString(renderTooltip);
assert.match(markup, /lui-tooltip__content/);
assert.match(markup, /role="tooltip"/);
assert.match(markup, /lui-tooltip__arrowTip/);
assert.match(markup, /<div\b[^>]*role="tooltip"/);
