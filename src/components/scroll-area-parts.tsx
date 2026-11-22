import { splitProps } from '../primitives/utils/split-props';
import { mergeProps } from '../primitives/utils/merge-props';
import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { renderScrollAreaPart, type ScrollAreaRuntimePartProps } from './scroll-area-part';
import type {
  ScrollAreaContentProps,
  ScrollAreaCornerProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaViewportProps,
} from './scroll-area-part-props';

/** Render the native scrolling viewport with the primitive's overflow behavior. */
export function ScrollAreaViewport<As extends ComponentIntrinsicElement = 'div'>(
  props: ScrollAreaViewportProps<As>,
): JSX.Element {
  return renderScrollAreaPart({ slot: 'viewport', props });
}

/** Render the measured content inside the viewport. */
export function ScrollAreaContent<As extends ComponentIntrinsicElement = 'div'>(
  props: ScrollAreaContentProps<As>,
): JSX.Element {
  return renderScrollAreaPart({ slot: 'content', props });
}

/** Render a machine-owned scrollbar with a default thumb. */
function ScrollAreaScrollbarImpl(props: ScrollAreaRuntimePartProps): JSX.Element {
  const [content, rest] = splitProps(props, ['children']);

  /** Create the default thumb only after the primitive provides scrollbar context. */
  function readChildren(): JSX.Element {
    return content.children === undefined ? <ScrollAreaThumb /> : content.children;
  }

  const withThumb = mergeProps(rest, {
    /** Keep an explicit child reactive after the machine mounts. */
    get children() {
      return readChildren();
    },
  });
  return renderScrollAreaPart({ slot: 'scrollbar', props: withThumb });
}

/** Expose the native scrollbar orientation and selected element types. */
export const ScrollAreaScrollbar = ScrollAreaScrollbarImpl as <
  As extends ComponentIntrinsicElement = 'div',
>(
  props: ScrollAreaScrollbarProps<As>,
) => JSX.Element;

/** Render the draggable scrollbar thumb. */
export function ScrollAreaThumb<As extends ComponentIntrinsicElement = 'div'>(
  props: ScrollAreaThumbProps<As>,
): JSX.Element {
  return renderScrollAreaPart({ slot: 'thumb', props });
}

/** Fill the intersection of horizontal and vertical scrollbars. */
export function ScrollAreaCorner<As extends ComponentIntrinsicElement = 'div'>(
  props: ScrollAreaCornerProps<As>,
): JSX.Element {
  return renderScrollAreaPart({ slot: 'corner', props });
}
