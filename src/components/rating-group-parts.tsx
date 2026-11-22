import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { renderRatingGroupPart } from './rating-group-part';
import type { RatingGroupItemProps, RatingGroupLabelProps } from './rating-group-part-props';

/** Label the current rating group through the primitive's native label behavior. */
export function RatingGroupLabel<As extends ComponentIntrinsicElement = 'label'>(
  props: RatingGroupLabelProps<As>,
): JSX.Element {
  return renderRatingGroupPart({ slot: 'label', props });
}

/** Bind one displayed rating value to the primitive's selection and hover state. */
export function RatingGroupItem<As extends ComponentIntrinsicElement = 'span'>(
  props: RatingGroupItemProps<As>,
): JSX.Element {
  return renderRatingGroupPart({ slot: 'item', props });
}
