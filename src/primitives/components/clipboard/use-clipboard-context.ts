import { createContext } from '../../utils/create-context';
import type { UseClipboardReturn } from './use-clipboard';

export type UseClipboardContext = UseClipboardReturn;

export const [ClipboardProvider, useClipboardContext] = createContext<UseClipboardContext>({
  hookName: 'useClipboardContext',
  providerName: '<ClipboardProvider />',
});
