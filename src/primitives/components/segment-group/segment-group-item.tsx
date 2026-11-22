import type { Assign } from '../../types';
import type { ItemProps, ItemState } from '@zag-js/radio-group';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSegmentGroupContext } from './use-segment-group-context';
import { SegmentGroupItemProvider } from './use-segment-group-item-context';
import { SegmentGroupItemPropsProvider } from './use-segment-group-item-props-context';

export type SegmentGroupItemState = ItemState;

export type SegmentGroupItemBaseProps = ItemProps &
  PolymorphicProps<'label', SegmentGroupItemState>;
export type SegmentGroupItemProps = Assign<HTMLProps<'label'>, SegmentGroupItemBaseProps>;

/** Render the SegmentGroup item. */
export const SegmentGroupItem = (props: SegmentGroupItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, [
    'value',
    'disabled',
    'invalid',
  ]);

  const segmentGroup = useSegmentGroupContext();
  const mergedProps = mergeProps(() => segmentGroup().getItemProps(itemProps), localProps);

  const itemState = createMemo(() => segmentGroup().getItemState(itemProps));

  return (
    <SegmentGroupItemPropsProvider value={itemProps}>
      <SegmentGroupItemProvider value={itemState}>
        <primitive.label {...mergedProps} state={segmentGroup().getItemState(itemProps)} />
      </SegmentGroupItemProvider>
    </SegmentGroupItemPropsProvider>
  );
};
