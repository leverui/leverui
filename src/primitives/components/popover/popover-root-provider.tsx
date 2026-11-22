import { mergeProps } from '../../utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import {
  PresenceProvider,
  type UsePresenceProps,
  splitPresenceProps,
  usePresence,
} from '../presence/index';
import type { UsePopoverReturn } from './use-popover';
import { PopoverLabelPartsProvider, PopoverProvider } from './use-popover-context';
import { createLabelParts } from '../../utils/label-parts';

interface RootProviderProps {
  value: UsePopoverReturn;
}

export type PopoverRootProviderBaseProps = RootProviderProps & UsePresenceProps;
export interface PopoverRootProviderProps extends PopoverRootProviderBaseProps {
  children?: JSX.Element;
}

/** Provide the Popover root provider to its children. */
export const PopoverRootProvider = (props: PopoverRootProviderProps) => {
  const [presenceProps, popoverProps] = splitPresenceProps(props);
  const presence = usePresence(
    mergeProps(presenceProps, () => ({ present: popoverProps.value().open })),
  );

  return (
    <PopoverProvider value={popoverProps.value}>
      <PopoverLabelPartsProvider value={createLabelParts()}>
        <PresenceProvider value={presence}>{popoverProps.children}</PresenceProvider>
      </PopoverLabelPartsProvider>
    </PopoverProvider>
  );
};
