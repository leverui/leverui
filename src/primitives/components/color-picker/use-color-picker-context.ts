import { createContext } from '../../utils/create-context';
import type { UseColorPickerReturn } from './use-color-picker';

export type UseColorPickerContext = UseColorPickerReturn;

export const [ColorPickerProvider, useColorPickerContext] = createContext<UseColorPickerContext>({
  hookName: 'useColorPickerContext',
  providerName: '<ColorPickerProvider />',
});
