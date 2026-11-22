import { type JSX } from '@solidjs/web';
import {
  type UseAccordionItemContext,
  useAccordionItemContext,
} from './use-accordion-item-context';

export interface AccordionItemContextProps {
  children: (context: UseAccordionItemContext) => JSX.Element;
}

/** Render the Accordion item context through a function child. */
export const AccordionItemContext = (props: AccordionItemContextProps) =>
  props.children(useAccordionItemContext());
