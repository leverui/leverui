import { createContext } from '../../utils/create-context';
import type { UseProgressReturn } from './use-progress';

export type UseProgressContext = UseProgressReturn;

export const [ProgressProvider, useProgressContext] = createContext<UseProgressContext>({
  hookName: 'useProgressContext',
  providerName: '<ProgressProvider />',
});
