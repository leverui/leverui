import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';
import { useMenuItemGroupContext } from './use-menu-item-group-context';

export type MenuItemGroupLabelBaseProps = PolymorphicProps<'div'>;
export type MenuItemGroupLabelProps = Assign<HTMLProps<'div'>, MenuItemGroupLabelBaseProps>;

/** Render the Menu item group label. */
export const MenuItemGroupLabel = (props: MenuItemGroupLabelProps) => {
  const context = useMenuContext();
  const itemGroupContext = useMenuItemGroupContext();
  const mergedProps = mergeProps(
    context().getItemGroupLabelProps({ htmlFor: itemGroupContext.id }),
    props,
  );

  return <primitive.div {...mergedProps} />;
};
