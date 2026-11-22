import { type JSX } from '@solidjs/web';
import { type UseToggleContext, useToggleContext } from './use-toggle-context';

export interface ToggleContextProps {
  children: (context: UseToggleContext) => JSX.Element;
}

/** Render the Toggle context context through a function child. */
export const ToggleContext = (props: ToggleContextProps) => props.children(useToggleContext());
