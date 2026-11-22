import type { ItemState } from '@zag-js/tags-input';
import { type Accessor } from 'solid-js';
import { createContext } from '../../utils/create-context';

export type UseTagsInputItemContext = Accessor<ItemState>;

export const [TagsInputItemProvider, useTagsInputItemContext] =
  createContext<UseTagsInputItemContext>({
    hookName: 'useTagsInputItemContext',
    providerName: '<TagsInputItemProvider />',
  });
