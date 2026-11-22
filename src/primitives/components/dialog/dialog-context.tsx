import { type JSX } from '@solidjs/web';
import { type UseDialogContext, useDialogContext } from './use-dialog-context';

export interface DialogContextProps {
  children: (context: UseDialogContext) => JSX.Element;
}

/** Render the Dialog context context through a function child. */
export const DialogContext = (props: DialogContextProps) => props.children(useDialogContext());
