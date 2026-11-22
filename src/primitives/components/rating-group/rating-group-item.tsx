import type { Assign } from '../../types';
import type { ItemProps, ItemState } from '@zag-js/rating-group';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useFieldContext } from '../field/index';
import { useRatingGroupContext } from './use-rating-group-context';
import { RatingGroupItemProvider } from './use-rating-group-item-context';

export type RatingGroupItemState = ItemState;

export type RatingGroupItemBaseProps = ItemProps & PolymorphicProps<'span', RatingGroupItemState>;
export type RatingGroupItemProps = Assign<HTMLProps<'span'>, RatingGroupItemBaseProps>;

/** Render the RatingGroup item. */
export const RatingGroupItem = (props: RatingGroupItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['index']);
  const api = useRatingGroupContext();
  const mergedProps = mergeProps(() => api().getItemProps(itemProps), localProps);
  const itemState = createMemo(() => api().getItemState(itemProps));
  const field = useFieldContext();

  return (
    <RatingGroupItemProvider value={itemState}>
      <primitive.span
        aria-describedby={field?.().ariaDescribedby}
        {...mergedProps}
        state={api().getItemState(itemProps)}
      />
    </RatingGroupItemProvider>
  );
};
