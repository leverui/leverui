import type { ItemState } from '@zag-js/select';
import { type Accessor } from 'solid-js';
import { createContext } from '../../utils/create-context';

export type UseSelectItemContext = Accessor<ItemState>;

export const [SelectItemProvider, useSelectItemContext] = createContext<UseSelectItemContext>({
  hookName: 'useSelectItemContext',
  providerName: '<SelectItemProvider />',
});
