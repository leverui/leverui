import { type JSX } from '@solidjs/web';
import { type UseDateInputContext, useDateInputContext } from './use-date-input-context';

export interface DateInputContextProps {
  children: (context: UseDateInputContext) => JSX.Element;
}

/** Render the DateInput context context through a function child. */
export const DateInputContext = (props: DateInputContextProps) =>
  props.children(useDateInputContext());
