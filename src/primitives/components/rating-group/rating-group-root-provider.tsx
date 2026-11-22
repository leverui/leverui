import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseRatingGroupReturn } from './use-rating-group';
import { RatingGroupProvider } from './use-rating-group-context';

interface RootProviderProps {
  value: UseRatingGroupReturn;
}

export type RatingGroupRootProviderBaseProps = PolymorphicProps<'div'>;
export type RatingGroupRootProviderProps = HTMLProps<'div'> &
  RootProviderProps &
  RatingGroupRootProviderBaseProps;

/** Provide the RatingGroup root provider to its children. */
export const RatingGroupRootProvider = (props: RatingGroupRootProviderProps) => {
  const [{ value: ratingGroup }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ]);
  const mergedProps = mergeProps(() => ratingGroup().getRootProps(), localProps);

  return (
    <RatingGroupProvider value={ratingGroup}>
      <primitive.div {...mergedProps} />
    </RatingGroupProvider>
  );
};
