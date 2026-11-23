import assert from 'node:assert/strict';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import {
  MarqueeContent,
  MarqueeEdge,
  MarqueeItem,
  MarqueeRoot,
  MarqueeViewport,
} from '@leverui/components';

/** Render the installed Marquee package in a separate Solid consumer. */
function renderMarquee() {
  return createComponent(MarqueeRoot, {
    translations: { root: 'Packed ticker' },
    /** Render the public viewport, content, item, and edge parts. */
    get children() {
      return [
        createComponent(MarqueeEdge, { side: 'start' }),
        createComponent(MarqueeViewport, {
          /** Keep the animated content inside the measured viewport. */
          get children() {
            return createComponent(MarqueeContent, {
              /** Give the primitive one item to repeat with each content copy. */
              get children() {
                return createComponent(MarqueeItem, { children: 'Packed item' });
              },
            });
          },
        }),
      ];
    },
  });
}

const markup = renderToString(renderMarquee);
assert.match(markup, /aria-roledescription="marquee"/);
assert.match(markup, /Packed ticker/);
assert.match(markup, /lui-marquee__content/);
assert.match(markup, /Packed item/);
