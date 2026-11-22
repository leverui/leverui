import { type JSX } from '@solidjs/web';
import type { CollectionItem } from '../collection/index';
import { type UseListboxContext, useListboxContext } from './use-listbox-context';

export interface ListboxContextProps<T extends CollectionItem> {
  children: (context: UseListboxContext<T>) => JSX.Element;
}

/** Render the Listbox context. */
export function ListboxContext<T extends CollectionItem>(props: ListboxContextProps<T>) {
  return props.children(useListboxContext());
}
