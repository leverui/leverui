import { createContext } from '../../utils/create-context';
import type { UseMarqueeReturn } from './use-marquee';

export type UseMarqueeContext = UseMarqueeReturn;

export const [MarqueeProvider, useMarqueeContext] = createContext<UseMarqueeContext>({
  hookName: 'useMarqueeContext',
  providerName: '<MarqueeProvider />',
});
