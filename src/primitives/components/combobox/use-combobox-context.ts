import { createContext } from '../../utils/create-context';
import type { CollectionItem } from '../collection/index';
import type { UseComboboxReturn } from './use-combobox';

export type UseComboboxContext<T extends CollectionItem> = UseComboboxReturn<T>;

export const [ComboboxProvider, useComboboxContext] = createContext<
  UseComboboxContext<CollectionItem>
>({
  hookName: 'useComboboxContext',
  providerName: '<ComboboxProvider />',
});
