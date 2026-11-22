import { createContext } from '../../utils/create-context';
import type { CollectionItem } from '../collection/index';
import type { UseListboxReturn } from './use-listbox';

export type UseListboxContext<T extends CollectionItem> = UseListboxReturn<T>;

export const [ListboxProvider, useListboxContext] = createContext<
  UseListboxContext<CollectionItem>
>({
  hookName: 'useListboxContext',
  providerName: '<ListboxProvider />',
});
