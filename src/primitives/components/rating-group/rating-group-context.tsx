import { type JSX } from '@solidjs/web';
import { type UseRatingGroupContext, useRatingGroupContext } from './use-rating-group-context';

export interface RatingGroupContextProps {
  children: (context: UseRatingGroupContext) => JSX.Element;
}

/** Render the RatingGroup context context through a function child. */
export const RatingGroupContext = (props: RatingGroupContextProps) =>
  props.children(useRatingGroupContext());
