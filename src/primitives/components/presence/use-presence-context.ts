import { createContext } from '../../utils/create-context';
import type { UsePresenceReturn } from './use-presence';

export type UsePresenceContext = UsePresenceReturn;

export const [PresenceProvider, usePresenceContext] = createContext<UsePresenceContext>({
  hookName: 'usePresenceContext',
  providerName: '<PresenceProvider />',
});
