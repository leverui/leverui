import { Marquee as PrimitiveMarquee } from '../primitives/components/marquee';

/** Match each styled Marquee slot to the primitive's native element. */
export const marqueePartTags = {
  viewport: 'div',
  content: 'div',
  item: 'div',
  edge: 'div',
} as const;

export type MarqueePartSlot = keyof typeof marqueePartTags;

/** Keep the primitive behavior behind the matching Lever UI part name. */
export const marqueePartComponents = {
  viewport: PrimitiveMarquee.Viewport,
  content: PrimitiveMarquee.Content,
  item: PrimitiveMarquee.Item,
  edge: PrimitiveMarquee.Edge,
} as const;
