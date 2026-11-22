import { type JSX } from '@solidjs/web';
import type { PrimitiveNativeTag } from './primitive-native-element-props';
import { renderMarqueePart } from './marquee-part';
import type {
  MarqueeContentProps,
  MarqueeEdgeProps,
  MarqueeItemProps,
  MarqueeViewportProps,
} from './marquee-part-props';

/** Clip and measure the animated Marquee content. */
export function MarqueeViewport<As extends PrimitiveNativeTag = 'div'>(
  props: MarqueeViewportProps<As>,
): JSX.Element {
  return renderMarqueePart('viewport', props);
}

/** Render the primitive's original and machine-requested content copies. */
export function MarqueeContent<As extends PrimitiveNativeTag = 'div'>(
  props: MarqueeContentProps<As>,
): JSX.Element {
  return renderMarqueePart('content', props);
}

/** Render one item with the primitive's semantics inside each content copy. */
export function MarqueeItem<As extends PrimitiveNativeTag = 'div'>(
  props: MarqueeItemProps<As>,
): JSX.Element {
  return renderMarqueePart('item', props);
}

/** Place an orientation-aware fade at one Marquee edge. */
export function MarqueeEdge<As extends PrimitiveNativeTag = 'div'>(
  props: MarqueeEdgeProps<As>,
): JSX.Element {
  return renderMarqueePart('edge', props);
}
