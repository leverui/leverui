import { type JSX } from '@solidjs/web';
import { type UseScrollAreaContext, useScrollAreaContext } from './use-scroll-area-context';

export interface ScrollAreaContextProps {
  children: (context: UseScrollAreaContext) => JSX.Element;
}

/** Render the ScrollArea context. */
export function ScrollAreaContext(props: ScrollAreaContextProps) {
  return props.children(useScrollAreaContext());
}
