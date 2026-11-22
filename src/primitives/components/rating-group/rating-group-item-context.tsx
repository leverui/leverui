import { type JSX } from '@solidjs/web';
import {
  type UseRatingGroupItemContext,
  useRatingGroupItemContext,
} from './use-rating-group-item-context';

export interface RatingGroupItemContextProps {
  children: (context: UseRatingGroupItemContext) => JSX.Element;
}

/** Render the RatingGroup item context. */
export const RatingGroupItemContext = (props: RatingGroupItemContextProps) =>
  props.children(useRatingGroupItemContext());
