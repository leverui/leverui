import { type JSX } from '@solidjs/web';
import { type UseTooltipContext, useTooltipContext } from './use-tooltip-context';

export interface TooltipContextProps {
  children: (context: UseTooltipContext) => JSX.Element;
}

/** Render the Tooltip context context through a function child. */
export const TooltipContext = (props: TooltipContextProps) => props.children(useTooltipContext());
