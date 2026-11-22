import { RatingGroup as PrimitiveRatingGroup } from '../primitives/components/rating-group';

/** Bind each styled part to its primitive behavior and native tag. */
export const ratingGroupPartTags = {
  label: 'label',
  item: 'span',
  control: 'div',
} as const;

export type RatingGroupPartSlot = keyof typeof ratingGroupPartTags;

/** Keep the machine-owned parts in one registry. */
export const ratingGroupPartComponents = {
  label: PrimitiveRatingGroup.Label,
  item: PrimitiveRatingGroup.Item,
  control: PrimitiveRatingGroup.Control,
} as const;
