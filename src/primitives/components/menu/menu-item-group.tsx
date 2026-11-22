import type { Assign } from '../../types';
import type { ItemGroupProps } from '@zag-js/menu';
import { mergeProps } from '../../utils/merge-part-props';
import { createUniqueId } from 'solid-js';
import type { Optional } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';
import { MenuItemGroupProvider } from './use-menu-item-group-context';

type OptionalItemGroupProps = Optional<ItemGroupProps, 'id'>;

export type MenuItemGroupBaseProps = OptionalItemGroupProps & PolymorphicProps<'div'>;
export type MenuItemGroupProps = Assign<HTMLProps<'div'>, MenuItemGroupBaseProps>;

/** Render the Menu item group. */
export const MenuItemGroup = (props: MenuItemGroupProps) => {
  const [optionalItemGroupProps, localProps] = createSplitProps<OptionalItemGroupProps>()(props, [
    'id',
  ]);
  const itemGroupProps = mergeProps({ id: createUniqueId() }, optionalItemGroupProps);
  const menu = useMenuContext();
  const mergedProps = mergeProps(() => menu().getItemGroupProps(itemGroupProps), localProps);

  return (
    <MenuItemGroupProvider value={itemGroupProps}>
      <primitive.div {...mergedProps} />
    </MenuItemGroupProvider>
  );
};
