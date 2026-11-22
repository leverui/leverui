import { createContext } from '../../utils/create-context';
import type { UseFloatingPanelReturn } from './use-floating-panel';

export type UseFloatingPanelContext = UseFloatingPanelReturn;

export const [FloatingPanelProvider, useFloatingPanelContext] =
  createContext<UseFloatingPanelContext>({
    hookName: 'useFloatingPanelContext',
    providerName: '<FloatingPanelProvider />',
  });
