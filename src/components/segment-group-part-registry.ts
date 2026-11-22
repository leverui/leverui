import { SegmentGroup as PrimitiveSegmentGroup } from '../primitives/components/segment-group';

/** Bind each styled Segment Group slot to its native element. */
export const segmentGroupPartTags = {
  item: 'label',
  itemText: 'span',
  indicator: 'div',
} as const;

export type SegmentGroupPartSlot = keyof typeof segmentGroupPartTags;

/** Keep the primitive behavior owned by the corresponding visual slot. */
export const segmentGroupPartComponents = {
  item: PrimitiveSegmentGroup.Item,
  itemText: PrimitiveSegmentGroup.ItemText,
  indicator: PrimitiveSegmentGroup.Indicator,
} as const;
