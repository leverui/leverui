import type { Assign } from '../../types';
import type { RootState as ControlState } from '@zag-js/rating-group';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useRatingGroupContext } from './use-rating-group-context';

export type RatingGroupControlState = ControlState;

export type RatingGroupControlBaseProps = PolymorphicProps<'div', RatingGroupControlState>;
export type RatingGroupControlProps = Assign<HTMLProps<'div'>, RatingGroupControlBaseProps>;

/** Render the RatingGroup control. */
export const RatingGroupControl = (props: RatingGroupControlProps) => {
  const ratingGroup = useRatingGroupContext();
  const mergedProps = mergeProps(() => ratingGroup().getControlProps(), props);
  const field = useFieldContext();

  return (
    <primitive.div
      aria-describedby={field?.().ariaDescribedby}
      {...mergedProps}
      state={ratingGroup().getRootState()}
    />
  );
};
