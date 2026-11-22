import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useMenuContext } from './use-menu-context';
import { useMenuItemPropsContext } from './use-menu-option-item-props-context';

export type MenuItemIndicatorBaseProps = PolymorphicProps<'span'>;
export type MenuItemIndicatorProps = Assign<HTMLProps<'span'>, MenuItemIndicatorBaseProps>;

/** Render the Menu item indicator. */
export const MenuItemIndicator = (props: MenuItemIndicatorProps) => {
  const context = useMenuContext();
  const itemProps = useMenuItemPropsContext();

  const mergedProps = mergeProps(() => context().getItemIndicatorProps(itemProps), props);

  return <primitive.span {...mergedProps} />;
};
