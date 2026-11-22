import { mergeProps } from '../../utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import {
  PresenceProvider,
  type UsePresenceProps,
  splitPresenceProps,
  usePresence,
} from '../presence/index';
import type { UseHoverCardReturn } from './use-hover-card';
import { HoverCardProvider } from './use-hover-card-context';

interface RootProviderProps {
  value: UseHoverCardReturn;
}

export type HoverCardRootProviderBaseProps = RootProviderProps & UsePresenceProps;
export interface HoverCardRootProviderProps extends HoverCardRootProviderBaseProps {
  children?: JSX.Element;
}

/** Provide the HoverCard root provider to its children. */
export const HoverCardRootProvider = (props: HoverCardRootProviderProps) => {
  const [presenceProps, hoverCardProps] = splitPresenceProps(props);
  const presence = usePresence(
    mergeProps(presenceProps, () => ({ present: hoverCardProps.value().open })),
  );

  return (
    <HoverCardProvider value={hoverCardProps.value}>
      <PresenceProvider value={presence}>{hoverCardProps.children}</PresenceProvider>
    </HoverCardProvider>
  );
};
