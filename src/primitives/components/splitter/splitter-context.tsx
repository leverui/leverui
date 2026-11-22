import { type JSX } from '@solidjs/web';
import { type UseSplitterContext, useSplitterContext } from './use-splitter-context';

export interface SplitterContextProps {
  children: (context: UseSplitterContext) => JSX.Element;
}

/** Render the Splitter context context through a function child. */
export const SplitterContext = (props: SplitterContextProps) =>
  props.children(useSplitterContext());
