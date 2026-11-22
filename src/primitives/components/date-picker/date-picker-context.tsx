import { type JSX } from '@solidjs/web';
import { type UseDatePickerContext, useDatePickerContext } from './use-date-picker-context';

export interface DatePickerContextProps {
  children: (context: UseDatePickerContext) => JSX.Element;
}

/** Render the DatePicker context context through a function child. */
export const DatePickerContext = (props: DatePickerContextProps) =>
  props.children(useDatePickerContext());
