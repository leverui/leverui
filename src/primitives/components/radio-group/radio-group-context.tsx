import { type JSX } from '@solidjs/web';
import { type UseRadioGroupContext, useRadioGroupContext } from './use-radio-group-context';

export interface RadioGroupContextProps {
  children: (context: UseRadioGroupContext) => JSX.Element;
}

/** Render the RadioGroup context context through a function child. */
export const RadioGroupContext = (props: RadioGroupContextProps) =>
  props.children(useRadioGroupContext());
