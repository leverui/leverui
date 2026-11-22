import type { ItemState } from '@zag-js/accordion';
import { type Accessor } from 'solid-js';
import { createContext } from '../../utils/create-context';

export type UseAccordionItemContext = Accessor<ItemState>;

export const [AccordionItemProvider, useAccordionItemContext] =
  createContext<UseAccordionItemContext>({
    hookName: 'useAccordionItemContext',
    providerName: '<AccordionItemProvider />',
  });
