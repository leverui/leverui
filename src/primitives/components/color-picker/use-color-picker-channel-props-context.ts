import type { ChannelProps } from '@zag-js/color-picker';
import { createContext } from '../../utils/create-context';

export type UseColorPickerChannelPropsContext = ChannelProps;

export const [ColorPickerChannelPropsProvider, useColorPickerChannelPropsContext] =
  createContext<UseColorPickerChannelPropsContext>({
    hookName: 'useColorPickerChannelSliderContext',
    providerName: '<ColorPickerChannelSliderProvider />',
  });
