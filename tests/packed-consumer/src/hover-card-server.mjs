import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import {
  HoverCardArrow,
  HoverCardArrowTip,
  HoverCardContent,
  HoverCardPositioner,
  HoverCardRoot,
} from '@leverui/components';

/** Render an initially open Hover Card with optional arrow and content choices. */
function renderCard(arrowProps = {}, contentAs, renderAfterArrow) {
  return createComponent(HoverCardRoot, {
    defaultOpen: true,
    /** Keep the floating surface under the primitive's presence provider. */
    get children() {
      return createComponent(HoverCardPositioner, {
        /** Render the styled content and arrow. */
        get children() {
          return createComponent(HoverCardContent, {
            as: contentAs,
            /** Preserve default arrow-tip composition in server markup. */
            get children() {
              return [
                createComponent(HoverCardArrow, arrowProps),
                renderAfterArrow?.(),
                'Installed member',
              ];
            },
          });
        },
      });
    },
  });
}

const markup = renderToString(renderCard);
assert.match(markup, /<div\b[^>]*lui-hoverCard__content/);
assert.match(markup, /lui-hoverCard__arrow/);
assert.match(markup, /lui-hoverCard__arrowTip/);
assert.match(markup, /Installed member/);

const stylesheet = readFileSync(
  new URL(import.meta.resolve('@leverui/components/styles.css')),
  'utf8',
);
assert.match(
  stylesheet,
  /\.lui-hoverCard__arrowTip:not\(\[data-unstyled\]\)\s*\{[^}]*border-top-width: 0\.5px;[^}]*border-left-width: 0\.5px;/,
);

const selectedContent = renderToString(
  /** Render the same Hover Card with a caller-selected content tag. */
  () => renderCard({}, 'article'),
);
assert.match(selectedContent, /<article\b[^>]*lui-hoverCard__content/);

const emptyArrow = renderToString(
  /** Suppress the Arrow's default tip without removing the Arrow. */
  () => renderCard({ children: null }),
);
assert.match(emptyArrow, /lui-hoverCard__arrow/);
assert.doesNotMatch(emptyArrow, /lui-hoverCard__arrowTip/);

const customArrow = renderToString(
  /** Render caller content without an automatic ArrowTip part. */
  () => renderCard({ children: 'Custom tip' }),
);
assert.match(customArrow, /Custom tip/);
assert.doesNotMatch(customArrow, /lui-hoverCard__arrowTip/);

const separateTipMarkup = renderToString(
  /** Render a visible tip after an Arrow that declines its default tip. */
  () =>
    renderCard(
      { children: null },
      undefined,
      /** Mount a separate authored tip after the Arrow part. */
      () => createComponent(HoverCardArrowTip, { id: 'visible-tip' }),
    ),
);
assert.match(separateTipMarkup, /lui-hoverCard__arrowTip/);
assert.match(
  separateTipMarkup,
  /data-hover-card-arrow[^>]*><\/div><div\b[^>]*data-hover-card-arrow-tip[^>]*id="visible-tip"/,
);
