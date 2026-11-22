import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import type { ItemProps, ItemState } from '@zag-js/steps';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useStepsContext } from './use-steps-context';
import { StepsItemProvider } from './use-steps-item-context';
import { StepsItemPropsProvider } from './use-steps-item-props-context';

export type StepsItemState = ItemState;

export type StepsItemBaseProps = ItemProps & PolymorphicProps<'div', StepsItemState>;
export type StepsItemProps = Assign<HTMLProps<'div'>, StepsItemBaseProps>;

/** Render the Steps item. */
export const StepsItem = (props: StepsItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['value']);
  const steps = useStepsContext();
  const mergedProps = mergeProps(() => steps().getItemProps(itemProps), localProps);
  const itemState = createMemo(() => steps().getItemState(itemProps));

  return (
    <StepsItemPropsProvider value={itemProps}>
      <StepsItemProvider value={itemState}>
        <primitive.div {...mergedProps} state={steps().getItemState(itemProps)} />
      </StepsItemProvider>
    </StepsItemPropsProvider>
  );
};
