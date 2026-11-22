import { createContext } from '../../utils/create-context';
import type { UseEditableReturn } from './use-editable';

export type UseEditableContext = UseEditableReturn;

export const [EditableProvider, useEditableContext] = createContext<UseEditableContext>({
  hookName: 'useEditableContext',
  providerName: '<EditableProvider />',
});
