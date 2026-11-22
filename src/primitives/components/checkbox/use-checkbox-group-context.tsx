import { createContext } from '../../utils/create-context';
import type { UseCheckboxGroupReturn } from './use-checkbox-group';

export type UseCheckboxGroupContext = UseCheckboxGroupReturn;

export const [CheckboxGroupContextProvider, useCheckboxGroupContext] = createContext<
  UseCheckboxGroupContext | undefined
>({
  hookName: 'useCheckboxGroupContext',
  providerName: '<CheckboxGroupProvider />',
  strict: false,
});
