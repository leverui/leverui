import { createContext } from '../../utils/create-context';
import type { UseSliderReturn } from './use-slider';

export type UseSliderContext = UseSliderReturn;

export const [SliderProvider, useSliderContext] = createContext<UseSliderContext>({
  hookName: 'useSliderContext',
  providerName: '<SliderProvider />',
});
