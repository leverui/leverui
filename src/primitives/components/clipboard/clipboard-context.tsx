import { type JSX } from '@solidjs/web';
import { type UseClipboardContext, useClipboardContext } from './use-clipboard-context';

export interface ClipboardContextProps {
  children: (context: UseClipboardContext) => JSX.Element;
}

/** Render the Clipboard context context through a function child. */
export const ClipboardContext = (props: ClipboardContextProps) =>
  props.children(useClipboardContext());
