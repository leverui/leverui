import { createContext } from '../../utils/create-context';
import type { UseScrollAreaReturn } from './use-scroll-area';

export type UseScrollAreaContext = UseScrollAreaReturn;

export const [ScrollAreaProvider, useScrollAreaContext] = createContext<UseScrollAreaContext>({
  hookName: 'useScrollAreaContext',
  providerName: '<ScrollAreaProvider />',
});
