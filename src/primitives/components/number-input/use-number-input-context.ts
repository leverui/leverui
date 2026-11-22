import { createContext } from '../../utils/create-context';
import type { UseNumberInputReturn } from './use-number-input';

export type UseNumberInputContext = UseNumberInputReturn;

export const [NumberInputProvider, useNumberInputContext] = createContext<UseNumberInputContext>({
  hookName: 'useNumberInputContext',
  providerName: '<NumberInputProvider />',
});
