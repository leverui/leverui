import { type JSX } from '@solidjs/web';
import { type UseSwitchContext, useSwitchContext } from './use-switch-context';

export interface SwitchContextProps {
  children: (context: UseSwitchContext) => JSX.Element;
}

/** Render the Switch context context through a function child. */
export const SwitchContext = (props: SwitchContextProps) => props.children(useSwitchContext());
