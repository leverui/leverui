import type { ItemProps } from '@zag-js/combobox';
import { createContext } from '../../utils/create-context';

export type UseComboboxItemPropsContext = ItemProps;

export const [ComboboxItemPropsProvider, useComboboxItemPropsContext] =
  createContext<UseComboboxItemPropsContext>({
    hookName: 'useComboboxItemPropsContext',
    providerName: '<ComboboxItemPropsProvider />',
  });
