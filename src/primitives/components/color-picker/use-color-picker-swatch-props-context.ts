import type { SwatchProps } from '@zag-js/color-picker';
import { type Accessor } from 'solid-js';
import { createContext } from '../../utils/create-context';

export type UseColorPickerSwatchPropsContext = Accessor<SwatchProps>;

export const [ColorPickerSwatchPropsProvider, useColorPickerSwatchPropsContext] =
  createContext<UseColorPickerSwatchPropsContext>({
    hookName: 'useColorPickerSwatchContext',
    providerName: '<ColorPickerSwatchProvider />',
  });
