import { mergeProps } from '../../utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import { createSplitProps } from '../../utils/create-split-props';
import {
  PresenceProvider,
  type UsePresenceProps,
  splitPresenceProps,
  usePresence,
} from '../presence/index';
import { type UseHoverCardProps, useHoverCard } from './use-hover-card';
import { HoverCardProvider } from './use-hover-card-context';

export type HoverCardRootBaseProps = UseHoverCardProps & UsePresenceProps;
export interface HoverCardRootProps extends HoverCardRootBaseProps {
  children?: JSX.Element;
}

/** Render the HoverCard root. */
export const HoverCardRoot = (props: HoverCardRootProps) => {
  const [presenceProps, hoverCardProps] = splitPresenceProps(props);
  const [useHoverCardProps, localProps] = createSplitProps<UseHoverCardProps>()(hoverCardProps, [
    'closeDelay',
    'defaultOpen',
    'disabled',
    'id',
    'ids',
    'onFocusOutside',
    'onInteractOutside',
    'onOpenChange',
    'onPointerDownOutside',
    'open',
    'openDelay',
    'positioning',
    'triggerValue',
    'defaultTriggerValue',
    'onTriggerValueChange',
  ]);
  const api = useHoverCard(useHoverCardProps);
  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: api().open })));

  return (
    <HoverCardProvider value={api}>
      <PresenceProvider value={apiPresence}>{localProps.children}</PresenceProvider>
    </HoverCardProvider>
  );
};
