import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useRatingGroupContext } from './use-rating-group-context';

export type RatingGroupLabelBaseProps = PolymorphicProps<'label'>;
export type RatingGroupLabelProps = Assign<HTMLProps<'label'>, RatingGroupLabelBaseProps>;

/** Render the RatingGroup label. */
export const RatingGroupLabel = (props: RatingGroupLabelProps) => {
  const api = useRatingGroupContext();
  const mergedProps = mergeProps(() => api().getLabelProps(), props);

  return <primitive.label {...mergedProps} />;
};
