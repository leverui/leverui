import type { ItemGroupProps } from '@zag-js/listbox';
import { createContext } from '../../utils/create-context';

export type UseListboxItemGroupPropsContext = ItemGroupProps;

export const [ListboxItemGroupPropsProvider, useListboxItemGroupPropsContext] =
  createContext<ItemGroupProps>({
    hookName: 'useListboxItemGroupPropsContext',
    providerName: '<ListboxItemGroupPropsProvider />',
  });
