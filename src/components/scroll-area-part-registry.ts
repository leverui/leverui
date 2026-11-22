import { ScrollArea as PrimitiveScrollArea } from '../primitives/components/scroll-area';

/** Bind every styled ScrollArea slot to its native element. */
export const scrollAreaPartTags = {
  viewport: 'div',
  content: 'div',
  scrollbar: 'div',
  thumb: 'div',
  corner: 'div',
} as const;

export type ScrollAreaPartSlot = keyof typeof scrollAreaPartTags;

/** Keep scrolling and pointer behavior inside the matching primitive parts. */
export const scrollAreaPartComponents = {
  viewport: PrimitiveScrollArea.Viewport,
  content: PrimitiveScrollArea.Content,
  scrollbar: PrimitiveScrollArea.Scrollbar,
  thumb: PrimitiveScrollArea.Thumb,
  corner: PrimitiveScrollArea.Corner,
} as const;
