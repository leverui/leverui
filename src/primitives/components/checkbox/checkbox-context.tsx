import { type JSX } from '@solidjs/web';
import { type UseCheckboxContext, useCheckboxContext } from './use-checkbox-context';

export interface CheckboxContextProps {
  children: (context: UseCheckboxContext) => JSX.Element;
}

/** Render the Checkbox context context through a function child. */
export const CheckboxContext = (props: CheckboxContextProps) =>
  props.children(useCheckboxContext());
