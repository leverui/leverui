import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';
import { useMenuItemPropsContext } from './use-menu-option-item-props-context';

export type MenuItemTextBaseProps = PolymorphicProps<'div'>;
export type MenuItemTextProps = Assign<HTMLProps<'div'>, MenuItemTextBaseProps>;

/** Render the Menu item text. */
export const MenuItemText = (props: MenuItemTextProps) => {
  const context = useMenuContext();
  const itemProps = useMenuItemPropsContext();

  const mergedProps = mergeProps(() => context().getItemTextProps(itemProps), props);

  return <primitive.div {...mergedProps} />;
};
