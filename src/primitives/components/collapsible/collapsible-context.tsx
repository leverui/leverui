import { type JSX } from '@solidjs/web';
import { type UseCollapsibleContext, useCollapsibleContext } from './use-collapsible-context';

export interface CollapsibleContextProps {
  children: (context: UseCollapsibleContext) => JSX.Element;
}

/** Render the Collapsible context context through a function child. */
export const CollapsibleContext = (props: CollapsibleContextProps) =>
  props.children(useCollapsibleContext());
