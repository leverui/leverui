import { mergeProps } from '../../utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import { createSplitProps } from '../../utils/create-split-props';
import type { UsePresenceProps } from '../presence/index';
import { PresenceProvider, usePresence } from '../presence/index';
import { splitPresenceProps } from '../presence/split-presence-props';
import { type UseFloatingPanelProps, useFloatingPanel } from './use-floating-panel';
import { FloatingPanelProvider } from './use-floating-panel-context';

export type FloatingPanelRootBaseProps = UseFloatingPanelProps & UsePresenceProps;
export interface FloatingPanelRootProps extends FloatingPanelRootBaseProps {
  children?: JSX.Element;
}

/** Render the FloatingPanel root. */
export const FloatingPanelRoot = (props: FloatingPanelRootProps) => {
  const [presenceProps, otherProps] = splitPresenceProps(props);
  const [useFloatingPanelProps, localProps] = createSplitProps<UseFloatingPanelProps>()(
    otherProps,
    [
      'allowOverflow',
      'closeOnEscape',
      'defaultOpen',
      'defaultPosition',
      'defaultSize',
      'dir',
      'disabled',
      'draggable',
      'getAnchorPosition',
      'getBoundaryEl',
      'gridSize',
      'finalFocusEl',
      'id',
      'ids',
      'initialFocusEl',
      'lockAspectRatio',
      'maxSize',
      'minSize',
      'onOpenChange',
      'onPositionChange',
      'onPositionChangeEnd',
      'onSizeChange',
      'onSizeChangeEnd',
      'onStageChange',
      'open',
      'persistRect',
      'position',
      'resizable',
      'restoreFocus',
      'size',
      'strategy',
      'translations',
    ],
  );

  const floatingPanel = useFloatingPanel(useFloatingPanelProps);

  const usePresenceProps = mergeProps(() => ({ present: floatingPanel().open }), presenceProps);
  const presence = usePresence(usePresenceProps);

  return (
    <FloatingPanelProvider value={floatingPanel}>
      <PresenceProvider value={presence}>{localProps.children}</PresenceProvider>
    </FloatingPanelProvider>
  );
};
