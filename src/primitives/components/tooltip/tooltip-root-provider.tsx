import { mergeProps } from '../../utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import {
  PresenceProvider,
  type UsePresenceProps,
  splitPresenceProps,
  usePresence,
} from '../presence/index';
import type { UseTooltipReturn } from './use-tooltip';
import { TooltipProvider } from './use-tooltip-context';

interface RootProviderProps {
  value: UseTooltipReturn;
}

export type TooltipRootProviderBaseProps = RootProviderProps & UsePresenceProps;
export interface TooltipRootProviderProps extends TooltipRootProviderBaseProps {
  children?: JSX.Element;
}

/** Provide the Tooltip root provider to its children. */
export const TooltipRootProvider = (props: TooltipRootProviderProps) => {
  const [presenceProps, tooltipProps] = splitPresenceProps(props);
  const presence = usePresence(
    mergeProps(presenceProps, () => ({ present: tooltipProps.value().open })),
  );

  return (
    <TooltipProvider value={tooltipProps.value}>
      <PresenceProvider value={presence}>{tooltipProps.children}</PresenceProvider>
    </TooltipProvider>
  );
};
