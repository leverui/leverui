import { type JSX } from '@solidjs/web';
import { type UsePopoverContext, usePopoverContext } from './use-popover-context';

export interface PopoverContextProps {
  children: (context: UsePopoverContext) => JSX.Element;
}

/** Render the Popover context context through a function child. */
export const PopoverContext = (props: PopoverContextProps) => props.children(usePopoverContext());
