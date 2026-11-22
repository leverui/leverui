import { createContext } from '../../utils/create-context';
import type { LabelParts } from '../../utils/label-parts';
import type { UseDialogReturn } from './use-dialog';

export type UseDialogContext = UseDialogReturn;

export const [DialogProvider, useDialogContext] = createContext<UseDialogContext>({
  hookName: 'useDialogContext',
  providerName: '<DialogProvider />',
});

/**
 * Which of the Dialog's title and description parts are rendered, so its content only points
 * at the ones that exist. Loose: content rendered without a root keeps the machine's props.
 */
export const [DialogLabelPartsProvider, useDialogLabelParts] = createContext<LabelParts>({
  strict: false,
  hookName: 'useDialogLabelParts',
  providerName: '<DialogLabelPartsProvider />',
});
