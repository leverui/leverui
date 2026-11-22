import { createContext } from '../../utils/create-context';
import type { UseAccordionReturn } from './use-accordion';

export type UseAccordionContext = UseAccordionReturn;

export const [AccordionProvider, useAccordionContext] = createContext<UseAccordionContext>({
  hookName: 'useAccordionContext',
  providerName: '<AccordionProvider />',
});
