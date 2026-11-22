import { mergeProps } from '../../utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import { createSplitProps } from '../../utils/create-split-props';
import type { UsePresenceProps } from '../presence/index';
import { PresenceProvider, splitPresenceProps, usePresence } from '../presence/index';
import type { UseFloatingPanelReturn } from './use-floating-panel';
import { FloatingPanelProvider } from './use-floating-panel-context';

interface RootProviderProps {
  value: UseFloatingPanelReturn;
}

export type FloatingPanelRootProviderBaseProps = RootProviderProps &
  Omit<UsePresenceProps, 'present'>;
export interface FloatingPanelRootProviderProps extends FloatingPanelRootProviderBaseProps {
  children?: JSX.Element;
}

/** Provide the FloatingPanel root provider to its children. */
export const FloatingPanelRootProvider = (props: FloatingPanelRootProviderProps) => {
  const [presenceProps, baseProps] = splitPresenceProps(props);

  const [rootProps, localProps] = createSplitProps<RootProviderProps>()(baseProps, ['value']);
  const presence = usePresence(
    mergeProps(() => ({ present: rootProps.value().open }), presenceProps),
  );

  return (
    <FloatingPanelProvider value={rootProps.value}>
      <PresenceProvider value={presence}>{localProps.children}</PresenceProvider>
    </FloatingPanelProvider>
  );
};
