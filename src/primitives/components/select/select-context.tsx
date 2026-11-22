import { type JSX } from '@solidjs/web';
import { type UseSelectContext, useSelectContext } from './use-select-context';
import type { CollectionItem } from '../collection/index';

export interface SelectContextProps<T extends CollectionItem> {
  children: (context: UseSelectContext<T>) => JSX.Element;
}

/** Render the Select context. */
export const SelectContext = <T extends CollectionItem>(props: SelectContextProps<T>) =>
  props.children(useSelectContext());
