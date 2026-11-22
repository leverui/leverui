import { mergeProps } from '../../utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import { createSplitProps } from '../../utils/create-split-props';
import {
  PresenceProvider,
  type UsePresenceProps,
  splitPresenceProps,
  usePresence,
} from '../presence/index';
import { type UsePopoverProps, usePopover } from './use-popover';
import { PopoverLabelPartsProvider, PopoverProvider } from './use-popover-context';
import { createLabelParts } from '../../utils/label-parts';

export type PopoverRootBaseProps = UsePopoverProps & UsePresenceProps;
export interface PopoverRootProps extends PopoverRootBaseProps {
  children?: JSX.Element;
}

/** Render the Popover root. */
export const PopoverRoot = (props: PopoverRootProps) => {
  const [presenceProps, popoverProps] = splitPresenceProps(props);
  const [usePopoverProps, localProps] = createSplitProps<UsePopoverProps>()(popoverProps, [
    'autoFocus',
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
    'positioning',
    'restoreFocus',
    'translations',
    'triggerValue',
    'defaultTriggerValue',
    'onTriggerValueChange',
  ]);
  const api = usePopover(usePopoverProps);
  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: api().open })));

  return (
    <PopoverProvider value={api}>
      <PopoverLabelPartsProvider value={createLabelParts()}>
        <PresenceProvider value={apiPresence}>{localProps.children}</PresenceProvider>
      </PopoverLabelPartsProvider>
    </PopoverProvider>
  );
};
