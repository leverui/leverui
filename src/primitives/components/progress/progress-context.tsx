import { type JSX } from '@solidjs/web';
import { type UseProgressContext, useProgressContext } from './use-progress-context';

export interface ProgressContextProps {
  children: (context: UseProgressContext) => JSX.Element;
}

/** Render the Progress context context through a function child. */
export const ProgressContext = (props: ProgressContextProps) =>
  props.children(useProgressContext());
