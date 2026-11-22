import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useRatingGroupContext } from './use-rating-group-context';

export type RatingGroupHiddenInputBaseProps = PolymorphicProps<'input'>;
export type RatingGroupHiddenInputProps = Assign<
  HTMLProps<'input'>,
  RatingGroupHiddenInputBaseProps
>;

/** Render the RatingGroup hidden input. */
export const RatingGroupHiddenInput = (props: RatingGroupHiddenInputProps) => {
  const ratingGroup = useRatingGroupContext();
  const mergedProps = mergeProps(() => ratingGroup().getHiddenInputProps(), props);
  const field = useFieldContext();

  return <primitive.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />;
};
