import { createContext } from '../../utils/create-context';
import type { UseCarouselReturn } from './use-carousel';

export type UseCarouselContext = UseCarouselReturn;

export const [CarouselProvider, useCarouselContext] = createContext<UseCarouselContext>({
  hookName: 'useCarouselContext',
  providerName: '<CarouselProvider />',
});
