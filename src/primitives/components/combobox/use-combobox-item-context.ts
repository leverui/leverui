import type { ItemState } from '@zag-js/combobox';
import { type Accessor } from 'solid-js';
import { createContext } from '../../utils/create-context';

export type UseComboboxItemContext = Accessor<ItemState>;

export const [ComboboxItemProvider, useComboboxItemContext] = createContext<UseComboboxItemContext>(
  {
    hookName: 'useComboboxItemContext',
    providerName: '<ComboboxItemProvider />',
  },
);
