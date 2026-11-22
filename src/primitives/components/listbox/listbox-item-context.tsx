import { type JSX } from '@solidjs/web';
import { type UseListboxItemContext, useListboxItemContext } from './use-listbox-item-context';

export interface ListboxItemContextProps {
  children: (context: UseListboxItemContext) => JSX.Element;
}

/** Render the Listbox item context. */
export function ListboxItemContext(props: ListboxItemContextProps) {
  return props.children(useListboxItemContext());
}
