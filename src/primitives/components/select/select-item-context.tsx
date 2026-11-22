import { type JSX } from '@solidjs/web';
import { type UseSelectItemContext, useSelectItemContext } from './use-select-item-context';

export interface SelectItemContextProps {
  children: (context: UseSelectItemContext) => JSX.Element;
}

/** Render the Select item context through a function child. */
export const SelectItemContext = (props: SelectItemContextProps) =>
  props.children(useSelectItemContext());
