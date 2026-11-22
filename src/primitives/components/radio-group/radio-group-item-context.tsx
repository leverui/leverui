import { type JSX } from '@solidjs/web';
import {
  type UseRadioGroupItemContext,
  useRadioGroupItemContext,
} from './use-radio-group-item-context';

export interface RadioGroupItemContextProps {
  children: (context: UseRadioGroupItemContext) => JSX.Element;
}

/** Render the RadioGroup item context through a function child. */
export const RadioGroupItemContext = (props: RadioGroupItemContextProps) =>
  props.children(useRadioGroupItemContext());
