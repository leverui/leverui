import { type JSX } from '@solidjs/web';
import type { CollectionItem } from '../collection/index';
import { type UseComboboxContext, useComboboxContext } from './use-combobox-context';

export interface ComboboxContextProps<T extends CollectionItem> {
  children: (context: UseComboboxContext<T>) => JSX.Element;
}

/** Render the Combobox context. */
export const ComboboxContext = <T extends CollectionItem>(props: ComboboxContextProps<T>) =>
  props.children(useComboboxContext());
