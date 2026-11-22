import { type JSX } from '@solidjs/web';
import { type UseComboboxItemContext, useComboboxItemContext } from './use-combobox-item-context';

export interface ComboboxItemContextProps {
  children: (context: UseComboboxItemContext) => JSX.Element;
}

/** Render the Combobox item context through a function child. */
export const ComboboxItemContext = (props: ComboboxItemContextProps) =>
  props.children(useComboboxItemContext());
