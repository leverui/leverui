import type { ItemProps, ItemState } from '@zag-js/menu';
import { mergeProps } from '../../utils/merge-part-props';
import { createEffect, createMemo } from 'solid-js';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';
import { MenuItemProvider } from './use-menu-item-context';
import { MenuItemPropsProvider } from './use-menu-option-item-props-context';

interface ItemBaseProps extends ItemProps {
  /**
   * The function to call when the item is selected
   */
  onSelect?: VoidFunction;
}

export type MenuItemState = ItemState;

export type MenuItemBaseProps = ItemBaseProps & PolymorphicProps<'div', MenuItemState>;
export type MenuItemProps = Assign<HTMLProps<'div'>, MenuItemBaseProps>;

/** Render the Menu item. */
export const MenuItem = (props: MenuItemProps) => {
  const [itemProps, localProps] = createSplitProps<ItemBaseProps>()(props, [
    'closeOnSelect',
    'disabled',
    'value',
    'valueText',
    'onSelect',
  ]);
  const context = useMenuContext();
  const mergedProps = mergeProps(() => context().getItemProps(itemProps), localProps);
  const itemState = createMemo(() => context().getItemState(itemProps));

  createEffect(
    () => ({ api: context(), id: itemState().id, onSelect: itemProps.onSelect }),
    ({ api, id, onSelect }) => {
      const cleanup = api.addItemListener({ id, onSelect });
      return () => cleanup?.();
    },
  );

  return (
    <MenuItemPropsProvider value={itemProps}>
      <MenuItemProvider value={itemState}>
        <primitive.div {...mergedProps} state={context().getItemState(itemProps)} />
      </MenuItemProvider>
    </MenuItemPropsProvider>
  );
};
