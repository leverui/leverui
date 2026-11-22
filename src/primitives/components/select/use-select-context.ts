import { createContext } from '../../utils/create-context';
import type { CollectionItem } from '../collection/index';
import type { UseSelectReturn } from './use-select';

export type UseSelectContext<T extends CollectionItem> = UseSelectReturn<T>;

export const [SelectProvider, useSelectContext] = createContext<UseSelectContext<CollectionItem>>({
  hookName: 'useSelectContext',
  providerName: '<SelectProvider />',
});
