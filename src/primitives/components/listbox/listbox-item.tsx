import type { Assign } from '../../types';
import type { ItemProps, ItemState } from '@zag-js/listbox';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useListboxContext } from './use-listbox-context';
import { ListboxItemProvider } from './use-listbox-item-context';
import { ListboxItemPropsProvider } from './use-listbox-item-props-context';

export type ListboxItemState = ItemState;

export type ListboxItemBaseProps = ItemProps & PolymorphicProps<'div', ListboxItemState>;
export type ListboxItemProps = Assign<HTMLProps<'div'>, ListboxItemBaseProps>;

/** Render the Listbox item. */
export const ListboxItem = (props: ListboxItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, [
    'item',
    'highlightOnHover',
  ]);
  const listbox = useListboxContext();
  const mergedProps = mergeProps(() => listbox().getItemProps(itemProps), localProps);
  const itemState = createMemo(() => listbox().getItemState(itemProps));

  return (
    <ListboxItemPropsProvider value={itemProps}>
      <ListboxItemProvider value={itemState}>
        <primitive.div {...mergedProps} state={listbox().getItemState(itemProps)} />
      </ListboxItemProvider>
    </ListboxItemPropsProvider>
  );
};
