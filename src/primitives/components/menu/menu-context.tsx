import { type JSX } from '@solidjs/web';
import { type UseMenuContext, useMenuContext } from './use-menu-context';

export interface MenuContextProps {
  children: (context: UseMenuContext) => JSX.Element;
}

/** Render the Menu context context through a function child. */
export const MenuContext = (props: MenuContextProps) => props.children(useMenuContext());
