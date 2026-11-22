import { createContext } from '../../utils/create-context';
import type { UseCollapsibleReturn } from './use-collapsible';

export type UseCollapsibleContext = UseCollapsibleReturn;

export const [CollapsibleProvider, useCollapsibleContext] = createContext<UseCollapsibleContext>({
  hookName: 'useCollapsibleContext',
  providerName: '<CollapsibleProvider />',
});
