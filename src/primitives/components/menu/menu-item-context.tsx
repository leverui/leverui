import { type JSX } from '@solidjs/web';
import { type UseMenuItemContext, useMenuItemContext } from './use-menu-item-context';

export interface MenuItemContextProps {
  children: (context: UseMenuItemContext) => JSX.Element;
}

/** Render the Menu item context through a function child. */
export const MenuItemContext = (props: MenuItemContextProps) =>
  props.children(useMenuItemContext());
