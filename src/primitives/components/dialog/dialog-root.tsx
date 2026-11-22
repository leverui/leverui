import { mergeProps } from '../../utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import { createSplitProps } from '../../utils/create-split-props';
import { RenderStrategyProvider, splitRenderStrategyProps } from '../../utils/render-strategy';
import {
  PresenceProvider,
  type UsePresenceProps,
  splitPresenceProps,
  usePresence,
} from '../presence/index';
import { type UseDialogProps, useDialog } from './use-dialog';
import { DialogLabelPartsProvider, DialogProvider } from './use-dialog-context';
import { createLabelParts } from '../../utils/label-parts';

export type DialogRootBaseProps = UseDialogProps & UsePresenceProps;
export interface DialogRootProps extends DialogRootBaseProps {
  children?: JSX.Element;
}

/** Render the Dialog root. */
export const DialogRoot = (props: DialogRootProps) => {
  const [presenceProps, dialogProps] = splitPresenceProps(props);
  const [renderStrategyProps] = splitRenderStrategyProps(presenceProps);
  const [useDialogProps, localProps] = createSplitProps<UseDialogProps>()(dialogProps, [
    'aria-label',
    'closeOnEscape',
    'closeOnInteractOutside',
    'defaultOpen',
    'finalFocusEl',
    'id',
    'ids',
    'initialFocusEl',
    'modal',
    'onEscapeKeyDown',
    'onFocusOutside',
    'onInteractOutside',
    'onOpenChange',
    'onPointerDownOutside',
    'onRequestDismiss',
    'open',
    'persistentElements',
    'preventScroll',
    'restoreFocus',
    'role',
    'trapFocus',
    'triggerValue',
    'defaultTriggerValue',
    'onTriggerValueChange',
  ]);

  const api = useDialog(useDialogProps);
  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: api().open })));

  return (
    <DialogProvider value={api}>
      <DialogLabelPartsProvider value={createLabelParts()}>
        <RenderStrategyProvider value={renderStrategyProps}>
          <PresenceProvider value={apiPresence}>{localProps.children}</PresenceProvider>
        </RenderStrategyProvider>
      </DialogLabelPartsProvider>
    </DialogProvider>
  );
};
