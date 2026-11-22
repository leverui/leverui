import { type JSX } from '@solidjs/web';
import { type UseToastContext, useToastContext } from './use-toast-context';

export interface ToastContextProps {
  children: (context: UseToastContext) => JSX.Element;
}

/** Render the Toast context context through a function child. */
export const ToastContext = (props: ToastContextProps) => props.children(useToastContext());
