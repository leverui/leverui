import { createContext } from '../../utils/create-context';
import type { UseSwitchReturn } from './use-switch';

export type UseSwitchContext = UseSwitchReturn;

export const [SwitchProvider, useSwitchContext] = createContext<UseSwitchContext>({
  hookName: 'useSwitchContext',
  providerName: '<SwitchProvider />',
});
