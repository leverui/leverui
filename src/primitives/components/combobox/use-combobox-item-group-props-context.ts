import type { ItemGroupProps } from '@zag-js/combobox';
import { createContext } from '../../utils/create-context';

export type UseComboboxItemGroupPropsContext = ItemGroupProps;

export const [ComboboxItemGroupPropsProvider, useComboboxItemGroupPropsContext] =
  createContext<ItemGroupProps>({
    hookName: 'useComboboxItemGroupPropsContext',
    providerName: '<ComboboxItemGroupPropsProvider />',
  });
