import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createUniqueId } from 'solid-js';
import type { Optional } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';
import { MenuItemGroupProvider, type UseMenuItemGroupContext } from './use-menu-item-group-context';

type OptionalUseMenuItemGroupContext = Optional<UseMenuItemGroupContext, 'id'>;

export type MenuRadioItemGroupBaseProps = OptionalUseMenuItemGroupContext & PolymorphicProps<'div'>;
export type MenuRadioItemGroupProps = Assign<HTMLProps<'div'>, MenuRadioItemGroupBaseProps>;

/** Render the Menu radio item group. */
export const MenuRadioItemGroup = (props: MenuRadioItemGroupProps) => {
  const [optionalItemGroupProps, localProps] = createSplitProps<OptionalUseMenuItemGroupContext>()(
    props,
    ['id', 'onValueChange', 'value'],
  );
  const context = useMenuContext();
  const itemGroupProps = mergeProps({ id: createUniqueId() }, optionalItemGroupProps);
  const mergedProps = mergeProps(() => context().getItemGroupProps(itemGroupProps), localProps);

  return (
    <MenuItemGroupProvider value={itemGroupProps}>
      <primitive.div {...mergedProps} />
    </MenuItemGroupProvider>
  );
};
