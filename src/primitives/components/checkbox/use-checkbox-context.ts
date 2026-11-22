import { createContext } from '../../utils/create-context';
import type { UseCheckboxReturn } from './use-checkbox';

export type UseCheckboxContext = UseCheckboxReturn;

export const [CheckboxProvider, useCheckboxContext] = createContext<UseCheckboxContext>({
  hookName: 'useCheckboxContext',
  providerName: '<CheckboxProvider />',
});
