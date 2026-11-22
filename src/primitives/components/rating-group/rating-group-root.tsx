import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { type UseRatingGroupProps, useRatingGroup } from './use-rating-group';
import { RatingGroupProvider } from './use-rating-group-context';

export type RatingGroupRootBaseProps = UseRatingGroupProps & PolymorphicProps<'div'>;
export type RatingGroupRootProps = Assign<HTMLProps<'div'>, RatingGroupRootBaseProps>;

/** Render the RatingGroup root. */
export const RatingGroupRoot = (props: RatingGroupRootProps) => {
  const [useRatingProps, localProps] = createSplitProps<UseRatingGroupProps>()(props, [
    'allowHalf',
    'autoFocus',
    'count',
    'defaultValue',
    'disabled',
    'form',
    'id',
    'ids',
    'name',
    'onHoverChange',
    'onValueChange',
    'readOnly',
    'required',
    'translations',
    'value',
  ]);

  const api = useRatingGroup(useRatingProps);
  const mergedProps = mergeProps(() => api().getRootProps(), localProps);

  return (
    <RatingGroupProvider value={api}>
      <primitive.div {...mergedProps} />
    </RatingGroupProvider>
  );
};
