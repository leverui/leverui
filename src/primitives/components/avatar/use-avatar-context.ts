import { createContext } from '../../utils/create-context';
import type { UseAvatarReturn } from './use-avatar';

export type UseAvatarContext = UseAvatarReturn;

export const [AvatarProvider, useAvatarContext] = createContext<UseAvatarContext>({
  hookName: 'useAvatarContext',
  providerName: '<AvatarProvider />',
});
