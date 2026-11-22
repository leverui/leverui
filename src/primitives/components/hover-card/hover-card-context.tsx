import { type JSX } from '@solidjs/web';
import { type UseHoverCardContext, useHoverCardContext } from './use-hover-card-context';

export interface HoverCardContextProps {
  children: (context: UseHoverCardContext) => JSX.Element;
}

/** Render the HoverCard context context through a function child. */
export const HoverCardContext = (props: HoverCardContextProps) =>
  props.children(useHoverCardContext());
