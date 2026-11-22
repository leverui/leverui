import type { Assign } from '../../types';
import type { ItemProps, ItemState } from '@zag-js/select';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useSelectContext } from './use-select-context';
import { SelectItemProvider } from './use-select-item-context';
import { SelectItemPropsProvider } from './use-select-item-props-context';

export type SelectItemState = ItemState;

export type SelectItemBaseProps = ItemProps & PolymorphicProps<'div', SelectItemState>;
export type SelectItemProps = Assign<HTMLProps<'div'>, SelectItemBaseProps>;

/** Render the Select item. */
export const SelectItem = (props: SelectItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['item', 'persistFocus']);
  const select = useSelectContext();
  const mergedProps = mergeProps(() => select().getItemProps(itemProps), localProps);
  const itemState = createMemo(() => select().getItemState(itemProps));

  return (
    <SelectItemPropsProvider value={itemProps}>
      <SelectItemProvider value={itemState}>
        <primitive.div {...mergedProps} state={itemState()} />
      </SelectItemProvider>
    </SelectItemPropsProvider>
  );
};
