import { type JSX } from '@solidjs/web';
import { type UseNumberInputContext, useNumberInputContext } from './use-number-input-context';

export interface NumberInputContextProps {
  children: (context: UseNumberInputContext) => JSX.Element;
}

/** Render the NumberInput context context through a function child. */
export const NumberInputContext = (props: NumberInputContextProps) =>
  props.children(useNumberInputContext());
