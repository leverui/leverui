import type { Assign } from '../../types';
import type { ItemProps, ItemState } from '@zag-js/combobox';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useComboboxContext } from './use-combobox-context';
import { ComboboxItemProvider } from './use-combobox-item-context';
import { ComboboxItemPropsProvider } from './use-combobox-item-props-context';

export type ComboboxItemState = ItemState;

export type ComboboxItemBaseProps = ItemProps & PolymorphicProps<'div', ComboboxItemState>;
export type ComboboxItemProps = Assign<HTMLProps<'div'>, ComboboxItemBaseProps>;

/** Render the Combobox item. */
export const ComboboxItem = (props: ComboboxItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemProps>()(props, ['item', 'persistFocus']);
  const api = useComboboxContext();
  const mergedProps = mergeProps(() => api().getItemProps(itemProps), localProps);
  const itemState = createMemo(() => api().getItemState(itemProps));

  return (
    <ComboboxItemPropsProvider value={itemProps}>
      <ComboboxItemProvider value={itemState}>
        <primitive.div {...mergedProps} state={api().getItemState(itemProps)} />
      </ComboboxItemProvider>
    </ComboboxItemPropsProvider>
  );
};
