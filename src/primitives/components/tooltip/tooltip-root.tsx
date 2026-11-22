import { mergeProps } from '../../utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import { createSplitProps } from '../../utils/create-split-props';
import {
  PresenceProvider,
  type UsePresenceProps,
  splitPresenceProps,
  usePresence,
} from '../presence/index';
import { type UseTooltipProps, useTooltip } from './use-tooltip';
import { TooltipProvider } from './use-tooltip-context';

export type TooltipRootBaseProps = UseTooltipProps & UsePresenceProps;
export interface TooltipRootProps extends TooltipRootBaseProps {
  children?: JSX.Element;
}
/** Render the Tooltip root. */
export const TooltipRoot = (props: TooltipRootProps) => {
  const [presenceProps, tooltipProps] = splitPresenceProps(props);
  const [useTooltipProps, localProps] = createSplitProps<UseTooltipProps>()(tooltipProps, [
    'aria-label',
    'closeDelay',
    'closeOnClick',
    'closeOnEscape',
    'closeOnPointerDown',
    'closeOnScroll',
    'defaultOpen',
    'disabled',
    'id',
    'ids',
    'interactive',
    'onOpenChange',
    'open',
    'openDelay',
    'positioning',
    'triggerValue',
    'defaultTriggerValue',
    'onTriggerValueChange',
  ]);

  const api = useTooltip(useTooltipProps);
  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: api().open })));

  return (
    <TooltipProvider value={api}>
      <PresenceProvider value={apiPresence}>{localProps.children}</PresenceProvider>
    </TooltipProvider>
  );
};
