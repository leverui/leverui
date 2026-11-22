import { createContext } from '../../utils/create-context';
import type { LabelParts } from '../../utils/label-parts';
import type { UsePopoverReturn } from './use-popover';

export type UsePopoverContext = UsePopoverReturn;

export const [PopoverProvider, usePopoverContext] = createContext<UsePopoverContext>({
  hookName: 'usePopoverContext',
  providerName: '<PopoverProvider />',
});

/**
 * Which of the Popover's title and description parts are rendered, so its content only points
 * at the ones that exist. Loose: content rendered without a root keeps the machine's props.
 */
export const [PopoverLabelPartsProvider, usePopoverLabelParts] = createContext<LabelParts>({
  strict: false,
  hookName: 'usePopoverLabelParts',
  providerName: '<PopoverLabelPartsProvider />',
});
